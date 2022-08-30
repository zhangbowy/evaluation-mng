import React, { useEffect, useState } from 'react';
import styles from './index.module.less';
import Loading from '@/components/loading';

function Share() {
  const [isShow, setIsShow] = useState(false);
  const [urlData, setUrlData] = useState('');
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
        !isShow ? <Loading /> : <iframe src={urlData} frameBorder="0" allowFullScreen={true}></iframe>
      }
    </div>
  );
}

export default Share;
