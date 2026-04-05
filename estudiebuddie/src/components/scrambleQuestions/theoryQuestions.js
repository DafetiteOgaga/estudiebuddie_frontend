import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { generateUniqueId } from "../../hooks/formHooks";
import { useDeviceInfo } from "../../hooks/deviceType";
// import { useConfirm } from "../../hooks/overlayContext";
const MAX_DEPTH = 3;

function TheoryBuilder({updateState, updateFromSavedTheory, confirm}) {
	// const { confirm } = useConfirm()
	const deviceInfo = useDeviceInfo()
	const isMobileDev = deviceInfo.width<=768
	const [theoryQuestions, setTheoryQuestions] = useState([
		{
			id: generateUniqueId(),
			text: "",
			children: []
		}
	]);
	const [nextSerial, setNextSerial] = useState(null)

	const updateNode = (id, text) => {
		setTheoryQuestions(prev => updateNodeById(prev, id, text));
	};

	const addChild = (id) => {
		setTheoryQuestions(prev => addChildById(prev, id));
	};

	const deleteNode = (id) => {
		setTheoryQuestions(prev => deleteNodeById(prev, id));
	};

	useEffect(() => {
		if (updateState) {
			updateState(theoryQuestions)
		}
	}, [theoryQuestions])

	useEffect(() => {
		if (updateFromSavedTheory) {
			setTheoryQuestions(updateFromSavedTheory)
		}
	}, [updateFromSavedTheory])

	return (
		<div className="">
			<h3 className="pb-05 q-mx">Theory Questions</h3>

			{theoryQuestions.map((node, i) => (
			<QuestionNode
				key={node.id}
				node={node}
				depth={0}
				index={i}
				path={[]}
				updateNode={updateNode}
				addChild={addChild}
				deleteNode={deleteNode}
				setNextSerial={setNextSerial}
				confirm={confirm}
				isMobileDev={isMobileDev}
			/>
			))}

			<button
			type="button"
			className="cta-button q-mx"
			onClick={() =>
				setTheoryQuestions(prev => [
				...prev,
				{ id: generateUniqueId(), text: "", children: [] }
				])
			}
			>
			<FontAwesomeIcon icon="plus"/> Add Question {nextSerial}
			</button>
		</div>
	);
}

function QuestionNode({ node, depth, index, path, updateNode, addChild, deleteNode, setNextSerial, confirm, isMobileDev }) {
	const serialNumber = getFullLabel(path, index, depth);
	// console.log({ serialNumber, depth, pathLength: path.length });
	useEffect(() => {
		const intSerialNumber = Number(serialNumber)
		if (!isNaN(intSerialNumber) && setNextSerial) {
			setNextSerial(intSerialNumber+1)
		}
	}, [serialNumber])
	const canAddNest = depth < MAX_DEPTH

	return (
		<div className={`form-group pt-05 ${(!depth||isMobileDev)?'q-mx':''}`}
		style={{ marginLeft: depth * 3, marginBottom: 5 }}>
			<div className="floating-field"
			style={{
				// position: "relative",
				display: "flex",
				gap: 2,
				}}>
				{/* <span>{label}</span> */}

				<textarea
				className="theory-questions"
				placeholder=" "
				value={node.text||""}
				rows={1}
				onChange={(e) =>{
					updateNode(node.id, e.target.value);;
				}}
				required
				/>
				<label
				className='left-textarea left-2'
				// style={questionData.question_mode==='text'?{}:compStyles.label}
				>{`Enter question ${serialNumber}`}</label>

				<div className="d-flex align-items-start">
					{canAddNest ?
					<button
					type="button"
					// style={{fontSize: 15}}
					className="cta-button theory-btn fit first"
					onClick={() => addChild(node.id)}><FontAwesomeIcon icon="circle-plus"/>
					</button>:null}
					<button
					type="button"
					className={`cta-button theory-btn fit bg-red-warn ${canAddNest?'last':''}`}
					onClick={() => {
						confirm({
							title: `Delete question ${serialNumber}?`,
							// message: "This action cannot be undone.",
							buttonText: "Yes, delete",
							onConfirm: () => {
								deleteNode(node.id)
							}})
						}}><FontAwesomeIcon icon="trash"/></button>
				</div>
			</div>

			{node.children.map((child, i) => (
				<QuestionNode
				key={child.id}
				node={child}
				depth={depth + 1}
				index={i}
				path={[...path, getLabel(index, depth)]}
				updateNode={updateNode}
				addChild={addChild}
				deleteNode={deleteNode}
				confirm={confirm}
				isMobileDev={isMobileDev}
				/>
			))}
		</div>
	);
}

const styles = ["numeric", "alphabet", "roman"];

function toAlphabet(n) {
	return String.fromCharCode(97 + n); // a, b, c
}

function toRoman(n) {
	const romans = ["i","ii","iii","iv","v","vi","vii","viii","ix","x"];
	return romans[n] || n;
}

function getLabel(index, depth) {
	const style = styles[depth % styles.length];

	if (style === "numeric") return `${index + 1}`;
	if (style === "alphabet") return toAlphabet(index);
	if (style === "roman") return toRoman(index);

	return index + 1;
}

function getFullLabel(path, index, depth) {
	const current = getLabel(index, depth);
	return [...path, current].join("");
}

function updateNodeById(tree, id, newText) {
	return tree.map(node => {
		if (node.id === id) {
			return { ...node, text: newText };
		}

		if (node.children.length) {
			return {
				...node,
				children: updateNodeById(node.children, id, newText)
			};
		}

		return node;
	});
}

function addChildById(tree, id) {
	return tree.map(node => {
		if (node.id === id) {
			return {
				...node,
				children: [
					...node.children,
					{
						id: generateUniqueId(),
						text: "",
						children: []
					}
				]
			};
		}

		if (node.children.length) {
			return {
				...node,
				children: addChildById(node.children, id)
			};
		}

		return node;
	});
}

function deleteNodeById(tree, id) {
	return tree
		.filter(node => node.id !== id)
		.map(node => ({
			...node,
			children: deleteNodeById(node.children, id)
		}));
}

export { TheoryBuilder };