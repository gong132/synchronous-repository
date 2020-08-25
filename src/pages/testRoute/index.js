import React, {useEffect, useState} from "react";


import A from './a'
import B from './b'
import {withRouter} from "umi";
const Index = withRouter(props => {
  const [childVisible, setChildVisible] = useState(false);
  useEffect(() => {
  }, [])
  return (
    <div>
      {
        childVisible && <A />
      }
      {
        !childVisible && <B />
      }
    </div>
  )
})
export default Index
