import React from "react"

export const AddMedia = ({ children, setFiles, accept }) => {
  return (
    <label>
      <input
        accept={accept}
        type="file"
        hidden
        multiple 
        onChange={(e) => {
          if (e.target.files?.length) {
            setFiles(e.target.files)
          }
        }}
      />
      {children}
    </label>
  )
}

export default AddMedia
