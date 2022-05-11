import React, { memo, PropsWithChildren } from 'react'
import ReactHighlight from 'react-highlight'

const Highlight: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <div>
      <p className="mb-[8px] text-[14px] font-semibold">
        Your generated script:
      </p>
      <div className="relative">
        <ReactHighlight className="language-js scroll-style">
          {children}
        </ReactHighlight>
      </div>
    </div>
  )
}

export default memo(Highlight)
