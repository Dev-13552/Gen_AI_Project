import React from 'react'
import { ClipLoader } from 'react-spinners';

const Loader = ({loading}) => {
    const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "#ff2d78",
  };
  return (
    <div>
      <ClipLoader
        color={"#fff"}
        loading={loading}
        cssOverride={override}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  )
}

export default Loader
