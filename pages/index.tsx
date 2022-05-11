import React, {MouseEvent} from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import styles from '../styles/Home.module.css'
import Params, { ParamsState } from '../components/Params'
import Actions, { ActionsState } from '../components/Actions'
import GenerateScript from '../components/GenerateScript'
import Highlight from '../components/Highlight'


const initialParams: ParamsState[] = [
  {
    value: 'utm_campaign',
  }
]

const Home = () => {

  const [paramsToRead, setParamsToRead] = useState<ParamsState[]>(initialParams)
  const [actions, setActions] = useState<ActionsState[]>([])
  const [generatedCode, setGeneratedCode] = useState<string | null>(null)

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
          <div className='w-[80vw] rounded-lg mt-14 shadow-xl p-8'>
            <Params paramsToRead={paramsToRead} setParamsToRead={setParamsToRead} />
          </div>

          <div className='w-[80vw] rounded-lg shadow-xl p-8 mt-20'>
            <Actions actions={actions} setActions={setActions} />
          </div>
          <div className='w-[80vw] mt-5'>
            <GenerateScript params={paramsToRead} actions={actions} setGeneratedCode={setGeneratedCode} />
          </div>
        </div>
        <div className='w-[80vw]'>
          {generatedCode && (
            <Highlight>
              {generatedCode}
            </Highlight>
          )}
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