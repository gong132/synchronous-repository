import React from 'react'
import styles from './searchForm.less'

const SearchForm = (props) => {
  const { labelName, children } = props

  return (
    <div className={styles.customSearchFormPer}>
      <span className={styles.customSearchFormPer__lablePer}>{labelName}</span>
      <div className={styles.customSearchFormPer__wrapperPer}>
        {children}
      </div>
    </div>
  )
}

export default SearchForm