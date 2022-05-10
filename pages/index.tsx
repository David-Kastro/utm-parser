import React, {MouseEvent} from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import styles from '../styles/Home.module.css'

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

interface ParamsState {
  value: string
  parsing?: Parsing
}

const initialParams: ParamsState[] = [
  {
    value: 'utm_campaign',
  }
]

const Home = () => {

  const [paramsToRead, setParamsToRead] = useState<ParamsState[]>(initialParams)
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
    }

    const newParamClone = JSON.parse(JSON.stringify(paramsToRead)) as ParamsState
    
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
    const newParamClone = JSON.parse(JSON.stringify(paramsToRead)) as ParamsState

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
    const newParamClone = JSON.parse(JSON.stringify(paramsToRead)) as ParamsState

    if(newParamClone?.parsing?.type !== ParsingTypes.CASE_MATCH || !newParamClone?.parsing?.cases) {
      return
    }

    newParamClone.parsing.cases[index][key] = value


    setNewParam(newParamClone)
  }

  const handleFormatInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value
    const newParamClone = JSON.parse(JSON.stringify(paramsToRead)) as ParamsState

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
    setParamsToRead([...paramsToRead, newParam])
  }

  const handleNewParam = () => {
    setEditingParam(paramsToRead.length)
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
            <input className='w-full' value={c.match} onChange={handleCaseInput('match', index)} />
          </div>
          <div className='w-3/12'>
            Return:
            <input className='w-full' value={c.return} onChange={handleCaseInput('return', index)} />
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
          <input className='w-full' value={newParam.parsing.format} disabled={true} onChange={handleFormatInput} />
        </div>
      )
    }

    return null
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>UTM Parser - by Ready To GO</title>
        <meta name="description" content="Generate a utm parser script for your website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={`${styles.title}`}>
          Welcome to UTM Parser! <small className=' bg-blue-400 text-white text-sm p-2 rounded-[5px]'>Powered by Ready To GO</small>
        </h1>

        <div>
          <div className='w-[80vw] h-[60vh] rounded-lg mt-14 shadow-xl p-8'>
            <h2>Add params to read</h2><br></br>
            <form className='flex flex-col'>
              {paramsToRead.map((param, index) => (
                <div key={`addedParam_${index}`} className='w-full'>
                  { editingParam === index && newParam ? (
                      <form className='flex flex-wrap w-full'>
                        <input className='w-10/12 text-xs p-2' placeholder='utm_campaign' onChange={handleParamValueInput} value={newParam.value}/>
                        <div className='w-2/12'>
                          {
                            newParam.parsing ? (
                              <div className=' cursor-pointer' onClick={addParsing()}>Parse value</div>
                            ) : (
                              <div className=' cursor-pointer' onClick={removeParsing}>Cancel Parse</div>
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
                    ) : (
                      <div className='flex w-full'>
                        <p className='grow text-xs p-2 rounded-[5px]'>{param.value}</p>
                        <div className=' cursor-pointer' onClick={handleEdit(param, index)}>Edit</div>
                        <div className=' cursor-pointer' onClick={handleNewParam}>New param</div>
                      </div>
                    )
                  }
                </div>
              ))}
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home

/**

Add params to read:
  utm_campaign
  utm_medium
  utm_source <parseValue> <+>


Actions:
  insert link

  insert attr
    query [#form.infusion] -> insertion text [id='']



 */