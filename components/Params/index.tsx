import React, {MouseEvent} from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import styles from '../styles/Home.module.css'

// Params
enum ParsingTypes {
  FORMAT = 'format',
  CASE_MATCH = 'casematch'
}

interface ParsingCase extends Record<string, string> {
  case: string
  match: string
  return: string
}

interface UnsetParsing {
  type: null
}
interface CaseMatch {
  type: ParsingTypes.CASE_MATCH
  cases: ParsingCase[]
}

interface Format {
  type: ParsingTypes.FORMAT
  format: string
}

type Parsing =  UnsetParsing | CaseMatch | Format;

export interface ParamsState {
  value: string
  parsing?: Parsing
}

interface ParamsProps {
    paramsToRead: ParamsState[],
    setParamsToRead: React.Dispatch<React.SetStateAction<ParamsState[]>>
}

const Params: React.FC<ParamsProps> = ({ paramsToRead, setParamsToRead }) => {

  const [editingParam, setEditingParam] = useState<number | null>(null)
  const [newParam, setNewParam] = useState<ParamsState | null>(null)

  const addParsing = (parsingType?: ParsingTypes) => () => {

    if(!newParam) {
      return
    }

    if(!parsingType) {
      setNewParam({
        value: newParam.value,
        parsing: {
          type: null
        }
      })

      return
    }

    const newParamClone = JSON.parse(JSON.stringify(newParam)) as ParamsState
    
    if(parsingType === ParsingTypes.CASE_MATCH) {
      newParamClone.parsing = {
        type: ParsingTypes.CASE_MATCH,
        cases: [{case: newParam.value, match: '', return: ''}]
      }
    }

    if(parsingType === ParsingTypes.FORMAT) {
      newParamClone.parsing = {
        type: ParsingTypes.FORMAT,
        format: ''
      }
    }

    setNewParam(newParamClone)
  }

  const addCase = () => {
    const newParamClone = JSON.parse(JSON.stringify(newParam)) as ParamsState

    if(newParamClone?.parsing?.type !== ParsingTypes.CASE_MATCH || !newParamClone?.parsing?.cases) {
      return
    }
    
    newParamClone.parsing.cases = [
      ...newParamClone.parsing.cases, 
      {case: newParamClone.value, match: '', return: ''}
    ]

    setNewParam(newParamClone)
  }

  const handleCaseInput: (key: string, index: number) => React.ChangeEventHandler<HTMLInputElement> = (key, index) => (e) => {
    const value = e.target.value
    const newParamClone = JSON.parse(JSON.stringify(newParam)) as ParamsState

    if(newParamClone?.parsing?.type !== ParsingTypes.CASE_MATCH || !newParamClone?.parsing?.cases) {
      return
    }

    newParamClone.parsing.cases[index][key] = value


    setNewParam(newParamClone)
  }

  const handleFormatInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value
    const newParamClone = JSON.parse(JSON.stringify(newParam)) as ParamsState

    if(newParamClone?.parsing?.type !== ParsingTypes.FORMAT || !newParamClone?.parsing?.format) {
      return
    }

    newParamClone.parsing.format = value


    setNewParam(newParamClone)
  }

  const handleParamValueInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value
    setNewParam({ ...newParam, value })
  }

  const handleEdit = (param: ParamsState, index: number) => () => {
    setEditingParam(index)
    setNewParam(param)
  }

  const handleCancel = () => {
    setEditingParam(null)
    setNewParam(null)
  }

  const handleSave = () => {
    if(!newParam) {
      return
    }

    if(editingParam !== null) {
      const newParamsClone = JSON.parse(JSON.stringify(paramsToRead)) as ParamsState[]

      newParamsClone[editingParam] = newParam
      setParamsToRead(newParamsClone)
      handleCancel()

      return
    }

    setParamsToRead([...paramsToRead, newParam])
    handleCancel()
  }

  const handleNewParam = () => {
    setNewParam({
      value: ''
    })
  }

  const removeParsing = () => {
    setNewParam({
      value: newParam?.value || ''
    })
  }

  const renderParsing = () => {

    if(!newParam || !newParam.parsing) {
      return null
    }

    if(
      newParam.parsing && 
      newParam.parsing.type && 
      newParam.parsing.type === ParsingTypes.CASE_MATCH
    ) {
      const casesLastIndex = newParam.parsing.cases.length - 1
      return newParam.parsing.cases.map((c, index) => (
        <div key={`addedCase_${index}`} className='flex w-full'>
          <div className='w-3/12 flex'>
            IF: 
            <input className='w-full' value={newParam.value} disabled={true} />
          </div>
          <div className='w-3/12'>
            Match:
            <input className='w-full' placeholder='this {param} value is {value}' value={c.match} onChange={handleCaseInput('match', index)} />
          </div>
          <div className='w-3/12'>
            Return:
            <input className='w-full' placeholder='this {param} value is {value}' value={c.return} onChange={handleCaseInput('return', index)} />
          </div>
          {index === casesLastIndex && <div className='w-3/12 cursor-pointer' onClick={addCase}>Add Case</div>}
        </div>
      ))
    }

    if(
      newParam.parsing && 
      newParam.parsing.type && 
      newParam.parsing.type === ParsingTypes.FORMAT
    ) {
      return (
        <div className='flex w-full'>
          <input className='w-full' placeholder='this {param} value is {value}' value={newParam.parsing.format} onChange={handleFormatInput} />
        </div>
      )
    }

    return null
  }

  const renderForm = () => {

    if(!newParam) {
      return
    }

    return (
      <form className='flex flex-wrap w-full'>
        <input className='w-10/12 text-xs p-2' placeholder='utm_campaign' onChange={handleParamValueInput} value={newParam.value}/>
        <div className='w-2/12'>
          {
            newParam.parsing ? (
              <div className=' cursor-pointer' onClick={removeParsing}>Cancel Parse</div>
            ) : (
              <div className=' cursor-pointer' onClick={addParsing()}>Parse value</div>
            )
          }
        </div>
        {
          newParam.parsing && !newParam.parsing.type && (
            <div className=''>
              <h3>Select a parsing type:</h3>
              <div className='flex'>
                <div className=' cursor-pointer' onClick={addParsing(ParsingTypes.CASE_MATCH)}>Case Match</div>
                <div className=' cursor-pointer' onClick={addParsing(ParsingTypes.FORMAT)}>Format</div>
              </div>
            </div>
          )
        }
        {renderParsing()}
        <div className=' cursor-pointer' onClick={handleCancel}>Cancel</div>
        <div className=' cursor-pointer' onClick={handleSave}>Save</div>
      </form>
    )
  }

  return (
    <div>
        <h2>Add params to read</h2><br></br>
        <div className=' cursor-pointer' onClick={handleNewParam}>New param</div>
        <div className='flex flex-col'>
            {paramsToRead.map((param, index) => (
                <div key={`addedParam_${index}`} className='w-full'>
                    { editingParam === index ? renderForm() : (
                        <div className='flex w-full'>
                            <p className='grow text-xs p-2 rounded-[5px]'>{param.value}</p>
                            <div className=' cursor-pointer' onClick={handleEdit(param, index)}>Edit</div>
                        </div>
                    )}
                </div>
            ))}
            {editingParam === null && renderForm()}
        </div>
    </div>
  )
}

export default Params
