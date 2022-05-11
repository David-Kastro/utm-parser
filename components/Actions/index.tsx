import React, { MouseEvent } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import styles from "../styles/Home.module.css";

import { ParamsState } from "../Params";

enum ActionTypes {
  INSERT_LINK = "insertlink",
  INSERT_ATTR = "insertattr",
}

export interface ActionsState {
  type: ActionTypes.INSERT_ATTR | ActionTypes.INSERT_LINK | null
  name: string
  query: string
  text: string
}

interface ActionsProps {
  actions: ActionsState[];
  setActions: React.Dispatch<React.SetStateAction<ActionsState[]>>;
}

const Actions: React.FC<ActionsProps> = ({ actions, setActions }) => {
  const [editingAction, setEditingAction] = useState<number | null>(null);
  const [newAction, setNewAction] = useState<ActionsState | null>(null);

  const addAction = (type?: ActionTypes) => () => {
    setNewAction({
      type: type || null,
      query: "",
      name: "",
      text: "",
    });
  };

	const handleActionInput: (key: keyof ActionsState) => React.ChangeEventHandler<HTMLInputElement> = (key) => (e) => {
		if (!newAction) {
      return null;
    }
    const value = e.target.value
    setNewAction({ ...newAction, [key]: value })
  }

	const handleEdit = (action: ActionsState, index: number) => () => {
		setEditingAction(index)
		setNewAction({...action});
	}

  const handleCancel = () => {
    setEditingAction(null)
    setNewAction(null)
  }

  const handleSave = () => {

		if(!newAction) {
			return
		}

		if(editingAction !== null) {
			const newActionsClone = JSON.parse(JSON.stringify(actions)) as ActionsState[]
			newActionsClone[editingAction] = newAction
			setActions(newActionsClone)
			handleCancel()
			return
		}

		setActions([...actions, newAction])
    handleCancel()
  }

  const renderForm = () => {
    if (!newAction) {
      return null;
    }

    return (
      <div>
        {newAction.type ? (
          <div className="flex flex-wrap w-full">
            <input className="w-full text-xs p-2" placeholder="Action name" value={newAction.name} onChange={handleActionInput('name')}/>
            <input className="w-6/12 text-xs p-2" placeholder="Query string" value={newAction.query} onChange={handleActionInput('query')}/>
            {newAction.type === ActionTypes.INSERT_ATTR && (
              <input className="w-6/12 text-xs p-2" placeholder="Attribute" value={newAction.text} onChange={handleActionInput('text')}/>
            )}
            {newAction.type === ActionTypes.INSERT_LINK && (
              <input className="w-6/12 text-xs p-2" placeholder="Link" value={newAction.text} onChange={handleActionInput('text')}/>
            )}
          </div>
        ) : (
          <div className="w-full">
            <h3>Select a parsing type:</h3>
            <div className="flex">
              <div
                className=" cursor-pointer"
                onClick={addAction(ActionTypes.INSERT_LINK)}
              >
                Insert Link
              </div>
              <div
                className=" cursor-pointer"
                onClick={addAction(ActionTypes.INSERT_ATTR)}
              >
                Insert Attribute
              </div>
            </div>
          </div>
        )}
				<div className="flex">
					<div className=" cursor-pointer" onClick={handleCancel}>
						Cancel
					</div>
					<div className=" cursor-pointer" onClick={handleSave}>
						Save
					</div>
				</div>
      </div>
    );
  };

  return (
    <div>
      <h2>Add actions</h2>
      <br></br>
      <div className=" cursor-pointer" onClick={addAction()}>
        New action
      </div>
      <div className="flex flex-col">
        {actions.map((action, index) => (
          <div key={`addedAction_${index}`} className="w-full">
            {editingAction === index ? (
              renderForm()
            ) : (
              <div className="flex w-full">
                <p className="grow text-xs p-2 rounded-[5px]">{action.name}</p>
                <div
                  className=" cursor-pointer"
                  onClick={handleEdit(action, index)}
                >
                  Edit
                </div>
              </div>
            )}
          </div>
        ))}
        {editingAction === null && renderForm()}
      </div>
    </div>
  );
};

export default Actions;
