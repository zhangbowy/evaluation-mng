import React, { useEffect, useState } from 'react';
import styles from './index.module.less';
import Loading from '@/components/loading';
import { useParams, useSearchParams } from 'react-router-dom'

function Share() {
  const [isShow, setIsShow] = useState(false);
  const [urlData, setUrlData] = useState('');
  const query = useParams();
  console.log(query, 'query11111111');
  useEffect(() => {
    setTimeout(() => {
      setUrlData('https://share.shanhaibi.com/62f5c17d88fe0/')
      setIsShow(true);
    }, 5000)
  }, []);
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
