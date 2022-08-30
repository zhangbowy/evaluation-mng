import React, { useEffect, useState } from 'react';
import styles from './index.module.less';

function Share() {
  const [isShow, setIsShow] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setIsShow(true);
    })
  }, []);
  return (
    <div className={styles.wrap}>
      {
        // https://share.shanhaibi.com/62f5c17d88fe0/
        isShow && <iframe src="https://share.shanhaibi.com/62f5c17d88fe0/" frameBorder="0" allowFullScreen={true}></iframe>
      }
    </div>
  );
}

export default Share;
