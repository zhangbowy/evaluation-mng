import React, { useEffect, useState } from 'react';
import styles from './index.module.less';
import { useParams, useSearchParams } from 'react-router-dom'

function Share() {
  const query = useParams();
  return (
    <div className={styles.wrap}>
      {
        // https://share.shanhaibi.com/62f5c17d88fe0/
        <iframe src={query.url} frameBorder="0" allowFullScreen={true}></iframe>
      }
    </div>
  );
}

export default Share;
