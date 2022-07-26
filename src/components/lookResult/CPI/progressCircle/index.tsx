import React, { useEffect, useRef } from 'react';
import styles from './index.module.less';

const index = (props: { percent: number }) => {
  useEffect(() => {
    percentFn();
  }, []);
  // 进度
  const percentFn = () => {
    const percent = props.percent / 100; //从接口获取到的圆环填充百分比
    const allCircle = document.querySelectorAll('circle');
    allCircle.forEach((item: SVGCircleElement, index: number) => {
      if (index % 2 !== 0) {
        percent > 0 && item.setAttribute('stroke-linecap', 'round');
        const perimeter = item.getTotalLength();
        item.setAttribute(
          'stroke-dasharray',
          perimeter * percent + ' ' + perimeter * (1 - percent),
        );
      }
    });
    // const perimeter = circle.getTotalLength(); //圆环的周长
    // percent > 0 && circle.setAttribute('stroke-linecap', 'round');
    // circle.setAttribute(
    //     'stroke-dasharray',
    //     perimeter * percent + ' ' + perimeter * (1 - percent),
    // );
  };
  return (
    <div className={styles.progressCircle_border}>
      <svg xmlns="http://www.w3.org/2000/svg" width={186} height={186}>
        <defs>
          <linearGradient x1="0%" y1="0%" x2="0%" y2="100%" id="linearGradient">
            <stop stopColor="#00E5FF" offset="0%"></stop>
            <stop stopColor="#6882FF" offset="100%"></stop>
          </linearGradient>
        </defs>
        <circle
          r="78"
          cy="93"
          cx="90"
          strokeWidth="14"
          stroke="#EAEFF4"
          strokeLinejoin="round" //圆角
          strokeLinecap="round" //圆角
          fill="none" // 不填充
        />
        <circle
          className={styles.progress}
          r="78"
          cy="93"
          cx="90"
          id="path"
          strokeWidth="14"
          stroke="url(#linearGradient)"
          strokeLinejoin="round" //圆角
          fill="none"
          strokeDasharray="0 1069"
          transform="rotate(-90, 90,93)"
        />
        <g id="编组" transform="translate(25, 28)" fill="#E2E6ED">
          <path
            d="M64.3636364,115.636364 C64.9661288,115.636364 65.4545455,116.12478 65.4545455,116.727273 L65.4545455,127.636364 C65.4545455,128.238856 64.9661288,128.727273 64.3636364,128.727273 C63.7611439,128.727273 63.2727273,128.238856 63.2727273,127.636364 L63.2727273,116.727273 C63.2727273,116.12478 63.7611439,115.636364 64.3636364,115.636364 Z M71.3519965,116.279574 L72.492307,127.128903 C72.5552846,127.728095 72.120597,128.26489 71.5214051,128.327867 C70.9222132,128.390845 70.3854187,127.956157 70.3224411,127.356966 L69.1821306,116.507636 C69.119153,115.908444 69.5538406,115.371649 70.1530325,115.308672 C70.7522244,115.245694 71.2890189,115.680382 71.3519965,116.279574 Z M58.5742402,115.308672 C59.1734322,115.371649 59.6081198,115.908444 59.5451422,116.507636 L58.4048316,127.356966 C58.341854,127.956157 57.8050596,128.390845 57.2058676,128.327867 C56.6066757,128.26489 56.1719881,127.728095 56.2349657,127.128903 L57.3752762,116.279574 C57.4382538,115.680382 57.9750483,115.245694 58.5742402,115.308672 Z M77.0653356,115.172049 L79.5193471,125.80154 C79.6548784,126.388591 79.2888497,126.974359 78.7017991,127.109891 C78.1147485,127.245422 77.5289801,126.879393 77.3934488,126.292343 L74.9394373,115.662851 C74.803906,115.0758 75.1699347,114.490032 75.7569853,114.354501 C76.3440359,114.218969 76.9298043,114.584998 77.0653356,115.172049 Z M52.9702874,114.354501 C53.5573381,114.490032 53.9233668,115.0758 53.7878355,115.662851 L51.333824,126.292343 C51.1982926,126.879393 50.6125243,127.245422 50.0254736,127.109891 C49.438423,126.974359 49.0723943,126.388591 49.2079256,125.80154 L51.6619371,115.172049 C51.7974684,114.584998 52.3832368,114.218969 52.9702874,114.354501 Z M82.7154197,113.424715 L86.2670723,123.739463 C86.4632247,124.309131 86.1604306,124.929951 85.5907628,125.126103 C85.021095,125.322256 84.4002751,125.019461 84.2041227,124.449794 L80.6524701,114.135046 C80.4563178,113.565378 80.7591119,112.944558 81.3287797,112.748406 C81.8984475,112.552253 82.5192674,112.855047 82.7154197,113.424715 Z M47.3984931,112.748406 C47.9681609,112.944558 48.270955,113.565378 48.0748026,114.135046 L44.52315,124.449794 C44.3269977,125.019461 43.7061778,125.322256 43.13651,125.126103 C42.5668421,124.929951 42.264048,124.309131 42.4602004,123.739463 L46.011853,113.424715 C46.2080054,112.855047 46.8288253,112.552253 47.3984931,112.748406 Z M88.0393925,111.075282 L92.8216232,120.880308 C93.0857385,121.421825 92.8608603,122.074918 92.3193437,122.339034 C91.7778271,122.603149 91.1247333,122.378271 90.860618,121.836754 L86.0783873,112.031728 C85.814272,111.490212 86.0391502,110.837118 86.5806669,110.573003 C87.1221835,110.308887 87.7752772,110.533766 88.0393925,111.075282 Z M42.1466059,110.573003 C42.6881225,110.837118 42.9130007,111.490212 42.6488854,112.031728 L37.8666547,121.836754 C37.6025394,122.378271 36.9494457,122.603149 36.407929,122.339034 C35.8664124,122.074918 35.6415342,121.421825 35.9056495,120.880308 L40.6878802,111.075282 C40.9519955,110.533766 41.6050892,110.308887 42.1466059,110.573003 Z M93.1594384,108.115879 L98.9403758,117.367313 C99.2596481,117.878256 99.1042687,118.551278 98.5933262,118.87055 C98.0823836,119.189823 97.4093614,119.034443 97.090089,118.523501 L91.3091516,109.272067 C90.9898792,108.761124 91.1452587,108.088102 91.6562012,107.76883 C92.1671438,107.449557 92.840166,107.604937 93.1594384,108.115879 Z M37.0710715,107.76883 C37.5820141,108.088102 37.7373935,108.761124 37.4181211,109.272067 L31.6371837,118.523501 C31.3179113,119.034443 30.6448892,119.189823 30.1339466,118.87055 C29.623004,118.551278 29.4676246,117.878256 29.7868969,117.367313 L35.5678344,108.115879 C35.8871067,107.604937 36.5601289,107.449557 37.0710715,107.76883 Z M97.827822,104.642202 L104.693135,113.120158 C105.072296,113.588382 105.000096,114.275324 104.531871,114.654485 C104.063647,115.033646 103.376705,114.961445 102.997544,114.49322 L96.1322308,106.015265 C95.75307,105.54704 95.8252705,104.860098 96.2934951,104.480938 C96.7617197,104.101777 97.4486612,104.173977 97.827822,104.642202 Z M32.4337777,104.480938 C32.9020022,104.860098 32.9742027,105.54704 32.5950419,106.015265 L25.7297286,114.49322 C25.3505678,114.961445 24.6636262,115.033646 24.1954016,114.654485 C23.727177,114.275324 23.6549766,113.588382 24.0341374,113.120158 L30.8994507,104.642202 C31.2786115,104.173977 31.9655531,104.101777 32.4337777,104.480938 Z M102.161708,100.61893 L109.8756,108.332822 C110.301627,108.758848 110.301627,109.449574 109.8756,109.8756 C109.449574,110.301627 108.758848,110.301627 108.332822,109.8756 L100.61893,102.161708 C100.192903,101.735681 100.192903,101.044956 100.61893,100.61893 C101.044956,100.192903 101.735681,100.192903 102.161708,100.61893 Z M28.1083432,100.61893 C28.5343697,101.044956 28.5343697,101.735681 28.1083432,102.161708 L20.3944511,109.8756 C19.9684246,110.301627 19.2776991,110.301627 18.8516726,109.8756 C18.4256461,109.449574 18.4256461,108.758848 18.8516726,108.332822 L26.5655648,100.61893 C26.9915913,100.192903 27.6823167,100.192903 28.1083432,100.61893 Z M106.015265,96.1322308 L114.49322,102.997544 C114.961445,103.376705 115.033646,104.063647 114.654485,104.531871 C114.275324,105.000096 113.588382,105.072296 113.120158,104.693135 L104.642202,97.827822 C104.173977,97.4486612 104.101777,96.7617197 104.480938,96.2934951 C104.860098,95.8252705 105.54704,95.75307 106.015265,96.1322308 Z M24.2463351,96.2934951 C24.6254959,96.7617197 24.5532954,97.4486612 24.0850709,97.827822 L15.6071149,104.693135 C15.1388903,105.072296 14.4519488,105.000096 14.072788,104.531871 C13.6936272,104.063647 13.7658277,103.376705 14.2340523,102.997544 L22.7120082,96.1322308 C23.1802328,95.75307 23.8671743,95.8252705 24.2463351,96.2934951 Z M109.272067,91.3091516 L118.523501,97.090089 C119.034443,97.4093614 119.189823,98.0823836 118.87055,98.5933262 C118.551278,99.1042687 117.878256,99.2596481 117.367313,98.9403758 L108.115879,93.1594384 C107.604937,92.840166 107.449557,92.1671438 107.76883,91.6562012 C108.088102,91.1452587 108.761124,90.9898792 109.272067,91.3091516 Z M20.9584429,91.6562012 C21.2777153,92.1671438 21.1223359,92.840166 20.6113933,93.1594384 L11.3599595,98.9403758 C10.8490169,99.2596481 10.1759948,99.1042687 9.8567224,98.5933262 C9.53745004,98.0823836 9.69282945,97.4093614 10.203772,97.090089 L19.4552058,91.3091516 C19.9661484,90.9898792 20.6391706,91.1452587 20.9584429,91.6562012 Z M112.031728,86.0783873 L121.836754,90.860618 C122.378271,91.1247333 122.603149,91.7778271 122.339034,92.3193437 C122.074918,92.8608603 121.421825,93.0857385 120.880308,92.8216232 L111.075282,88.0393925 C110.533766,87.7752772 110.308887,87.1221835 110.573003,86.5806669 C110.837118,86.0391502 111.490212,85.814272 112.031728,86.0783873 Z M18.1542701,86.5806669 C18.4183854,87.1221835 18.1935072,87.7752772 17.6519906,88.0393925 L7.84696464,92.8216232 C7.30544801,93.0857385 6.65235428,92.8608603 6.38823897,92.3193437 C6.12412366,91.7778271 6.34900187,91.1247333 6.8905185,90.860618 L16.6955445,86.0783873 C17.2370611,85.814272 17.8901548,86.0391502 18.1542701,86.5806669 Z M114.135046,80.6524701 L124.449794,84.2041227 C125.019461,84.4002751 125.322256,85.021095 125.126103,85.5907628 C124.929951,86.1604306 124.309131,86.4632247 123.739463,86.2670723 L113.424715,82.7154197 C112.855047,82.5192674 112.552253,81.8984475 112.748406,81.3287797 C112.944558,80.7591119 113.565378,80.4563178 114.135046,80.6524701 Z M15.9788672,81.3287797 C16.1750196,81.8984475 15.8722255,82.5192674 15.3025577,82.7154197 L4.98780957,86.2670723 C4.41814176,86.4632247 3.79732185,86.1604306 3.6011695,85.5907628 C3.40501714,85.021095 3.70781124,84.4002751 4.27747905,84.2041227 L14.5922271,80.6524701 C15.161895,80.4563178 15.7827149,80.7591119 15.9788672,81.3287797 Z M115.662851,74.9394373 L126.292343,77.3934488 C126.879393,77.5289801 127.245422,78.1147485 127.109891,78.7017991 C126.974359,79.2888497 126.388591,79.6548784 125.80154,79.5193471 L115.172049,77.0653356 C114.584998,76.9298043 114.218969,76.3440359 114.354501,75.7569853 C114.490032,75.1699347 115.0758,74.803906 115.662851,74.9394373 Z M14.372772,75.7569853 C14.5083034,76.3440359 14.1422746,76.9298043 13.555224,77.0653356 L2.92573242,79.5193471 C2.33868181,79.6548784 1.75291342,79.2888497 1.61738211,78.7017991 C1.4818508,78.1147485 1.84787951,77.5289801 2.43493012,77.3934488 L13.0644217,74.9394373 C13.6514723,74.803906 14.2372407,75.1699347 14.372772,75.7569853 Z M116.507636,69.1821306 L127.356966,70.3224411 C127.956157,70.3854187 128.390845,70.9222132 128.327867,71.5214051 C128.26489,72.120597 127.728095,72.5552846 127.128903,72.492307 L116.279574,71.3519965 C115.680382,71.2890189 115.245694,70.7522244 115.308672,70.1530325 C115.371649,69.5538406 115.908444,69.119153 116.507636,69.1821306 Z M13.418601,70.1530325 C13.4815786,70.7522244 13.046891,71.2890189 12.4476991,71.3519965 L1.5983693,72.492307 C0.999177366,72.5552846 0.462382887,72.120597 0.399405276,71.5214051 C0.336427666,70.9222132 0.771115265,70.3854187 1.3703072,70.3224411 L12.219637,69.1821306 C12.8188289,69.119153 13.3556234,69.5538406 13.418601,70.1530325 Z M127.636364,63.2727273 C128.238856,63.2727273 128.727273,63.7611439 128.727273,64.3636364 C128.727273,64.9661288 128.238856,65.4545455 127.636364,65.4545455 L116.727273,65.4545455 C116.12478,65.4545455 115.636364,64.9661288 115.636364,64.3636364 C115.636364,63.7611439 116.12478,63.2727273 116.727273,63.2727273 L127.636364,63.2727273 Z M12,63.2727273 C12.6024925,63.2727273 13.0909091,63.7611439 13.0909091,64.3636364 C13.0909091,64.9661288 12.6024925,65.4545455 12,65.4545455 L1.09090909,65.4545455 C0.488416637,65.4545455 4.17653411e-14,64.9661288 4.1543989e-14,64.3636364 C4.13226368e-14,63.7611439 0.488416637,63.2727273 1.09090909,63.2727273 L12,63.2727273 Z M128.327867,57.2058676 C128.390845,57.8050596 127.956157,58.341854 127.356966,58.4048316 L116.507636,59.5451422 C115.908444,59.6081198 115.371649,59.1734322 115.308672,58.5742402 C115.245694,57.9750483 115.680382,57.4382538 116.279574,57.3752762 L127.128903,56.2349657 C127.728095,56.1719881 128.26489,56.6066757 128.327867,57.2058676 Z M1.5983693,56.2349657 L12.4476991,57.3752762 C13.046891,57.4382538 13.4815786,57.9750483 13.418601,58.5742402 C13.3556234,59.1734322 12.8188289,59.6081198 12.219637,59.5451422 L1.3703072,58.4048316 C0.771115265,58.341854 0.336427666,57.8050596 0.399405276,57.2058676 C0.462382887,56.6066757 0.999177366,56.1719881 1.5983693,56.2349657 Z M127.109891,50.0254736 C127.245422,50.6125243 126.879393,51.1982926 126.292343,51.333824 L115.662851,53.7878355 C115.0758,53.9233668 114.490032,53.5573381 114.354501,52.9702874 C114.218969,52.3832368 114.584998,51.7974684 115.172049,51.6619371 L125.80154,49.2079256 C126.388591,49.0723943 126.974359,49.438423 127.109891,50.0254736 Z M2.92573242,49.2079256 L13.555224,51.6619371 C14.1422746,51.7974684 14.5083034,52.3832368 14.372772,52.9702874 C14.2372407,53.5573381 13.6514723,53.9233668 13.0644217,53.7878355 L2.43493012,51.333824 C1.84787951,51.1982926 1.4818508,50.6125243 1.61738211,50.0254736 C1.75291342,49.438423 2.33868181,49.0723943 2.92573242,49.2079256 Z M125.126103,43.13651 C125.322256,43.7061778 125.019461,44.3269977 124.449794,44.52315 L114.135046,48.0748026 C113.565378,48.270955 112.944558,47.9681609 112.748406,47.3984931 C112.552253,46.8288253 112.855047,46.2080054 113.424715,46.011853 L123.739463,42.4602004 C124.309131,42.264048 124.929951,42.5668421 125.126103,43.13651 Z M4.98780957,42.4602004 L15.3025577,46.011853 C15.8722255,46.2080054 16.1750196,46.8288253 15.9788672,47.3984931 C15.7827149,47.9681609 15.161895,48.270955 14.5922271,48.0748026 L4.27747905,44.52315 C3.70781124,44.3269977 3.40501714,43.7061778 3.6011695,43.13651 C3.79732185,42.5668421 4.41814176,42.264048 4.98780957,42.4602004 Z M122.339034,36.407929 C122.603149,36.9494457 122.378271,37.6025394 121.836754,37.8666547 L112.031728,42.6488854 C111.490212,42.9130007 110.837118,42.6881225 110.573003,42.1466059 C110.308887,41.6050892 110.533766,40.9519955 111.075282,40.6878802 L120.880308,35.9056495 C121.421825,35.6415342 122.074918,35.8664124 122.339034,36.407929 Z M7.84696464,35.9056495 L17.6519906,40.6878802 C18.1935072,40.9519955 18.4183854,41.6050892 18.1542701,42.1466059 C17.8901548,42.6881225 17.2370611,42.9130007 16.6955445,42.6488854 L6.8905185,37.8666547 C6.34900187,37.6025394 6.12412366,36.9494457 6.38823897,36.407929 C6.65235428,35.8664124 7.30544801,35.6415342 7.84696464,35.9056495 Z M118.87055,30.1339466 C119.189823,30.6448892 119.034443,31.3179113 118.523501,31.6371837 L109.272067,37.4181211 C108.761124,37.7373935 108.088102,37.5820141 107.76883,37.0710715 C107.449557,36.5601289 107.604937,35.8871067 108.115879,35.5678344 L117.367313,29.7868969 C117.878256,29.4676246 118.551278,29.623004 118.87055,30.1339466 Z M11.3599595,29.7868969 L20.6113933,35.5678344 C21.1223359,35.8871067 21.2777153,36.5601289 20.9584429,37.0710715 C20.6391706,37.5820141 19.9661484,37.7373935 19.4552058,37.4181211 L10.203772,31.6371837 C9.69282945,31.3179113 9.53745004,30.6448892 9.8567224,30.1339466 C10.1759948,29.623004 10.8490169,29.4676246 11.3599595,29.7868969 Z M114.654485,24.1954016 C115.033646,24.6636262 114.961445,25.3505678 114.49322,25.7297286 L106.015265,32.5950419 C105.54704,32.9742027 104.860098,32.9020022 104.480938,32.4337777 C104.101777,31.9655531 104.173977,31.2786115 104.642202,30.8994507 L113.120158,24.0341374 C113.588382,23.6549766 114.275324,23.727177 114.654485,24.1954016 Z M15.6071149,24.0341374 L24.0850709,30.8994507 C24.5532954,31.2786115 24.6254959,31.9655531 24.2463351,32.4337777 C23.8671743,32.9020022 23.1802328,32.9742027 22.7120082,32.5950419 L14.2340523,25.7297286 C13.7658277,25.3505678 13.6936272,24.6636262 14.072788,24.1954016 C14.4519488,23.727177 15.1388903,23.6549766 15.6071149,24.0341374 Z M109.8756,18.8516726 C110.301627,19.2776991 110.301627,19.9684246 109.8756,20.3944511 L102.161708,28.1083432 C101.735681,28.5343697 101.044956,28.5343697 100.61893,28.1083432 C100.192903,27.6823167 100.192903,26.9915913 100.61893,26.5655648 L108.332822,18.8516726 C108.758848,18.4256461 109.449574,18.4256461 109.8756,18.8516726 Z M20.3944511,18.8516726 L28.1083432,26.5655648 C28.5343697,26.9915913 28.5343697,27.6823167 28.1083432,28.1083432 C27.6823167,28.5343697 26.9915913,28.5343697 26.5655648,28.1083432 L18.8516726,20.3944511 C18.4256461,19.9684246 18.4256461,19.2776991 18.8516726,18.8516726 C19.2776991,18.4256461 19.9684246,18.4256461 20.3944511,18.8516726 Z M104.531871,14.072788 C105.000096,14.4519488 105.072296,15.1388903 104.693135,15.6071149 L97.827822,24.0850709 C97.4486612,24.5532954 96.7617197,24.6254959 96.2934951,24.2463351 C95.8252705,23.8671743 95.75307,23.1802328 96.1322308,22.7120082 L102.997544,14.2340523 C103.376705,13.7658277 104.063647,13.6936272 104.531871,14.072788 Z M25.7297286,14.2340523 L32.5950419,22.7120082 C32.9742027,23.1802328 32.9020022,23.8671743 32.4337777,24.2463351 C31.9655531,24.6254959 31.2786115,24.5532954 30.8994507,24.0850709 L24.0341374,15.6071149 C23.6549766,15.1388903 23.727177,14.4519488 24.1954016,14.072788 C24.6636262,13.6936272 25.3505678,13.7658277 25.7297286,14.2340523 Z M98.5933262,9.8567224 C99.1042687,10.1759948 99.2596481,10.8490169 98.9403758,11.3599595 L93.1594384,20.6113933 C92.840166,21.1223359 92.1671438,21.2777153 91.6562012,20.9584429 C91.1452587,20.6391706 90.9898792,19.9661484 91.3091516,19.4552058 L97.090089,10.203772 C97.4093614,9.69282945 98.0823836,9.53745004 98.5933262,9.8567224 Z M31.6371837,10.203772 L37.4181211,19.4552058 C37.7373935,19.9661484 37.5820141,20.6391706 37.0710715,20.9584429 C36.5601289,21.2777153 35.8871067,21.1223359 35.5678344,20.6113933 L29.7868969,11.3599595 C29.4676246,10.8490169 29.623004,10.1759948 30.1339466,9.8567224 C30.6448892,9.53745004 31.3179113,9.69282945 31.6371837,10.203772 Z M92.3193437,6.38823897 C92.8608603,6.65235428 93.0857385,7.30544801 92.8216232,7.84696464 L88.0393925,17.6519906 C87.7752772,18.1935072 87.1221835,18.4183854 86.5806669,18.1542701 C86.0391502,17.8901548 85.814272,17.2370611 86.0783873,16.6955445 L90.860618,6.8905185 C91.1247333,6.34900187 91.7778271,6.12412366 92.3193437,6.38823897 Z M37.8666547,6.8905185 L42.6488854,16.6955445 C42.9130007,17.2370611 42.6881225,17.8901548 42.1466059,18.1542701 C41.6050892,18.4183854 40.9519955,18.1935072 40.6878802,17.6519906 L35.9056495,7.84696464 C35.6415342,7.30544801 35.8664124,6.65235428 36.407929,6.38823897 C36.9494457,6.12412366 37.6025394,6.34900187 37.8666547,6.8905185 Z M85.5907628,3.6011695 C86.1604306,3.79732185 86.4632247,4.41814176 86.2670723,4.98780957 L82.7154197,15.3025577 C82.5192674,15.8722255 81.8984475,16.1750196 81.3287797,15.9788672 C80.7591119,15.7827149 80.4563178,15.161895 80.6524701,14.5922271 L84.2041227,4.27747905 C84.4002751,3.70781124 85.021095,3.40501714 85.5907628,3.6011695 Z M44.52315,4.27747905 L48.0748026,14.5922271 C48.270955,15.161895 47.9681609,15.7827149 47.3984931,15.9788672 C46.8288253,16.1750196 46.2080054,15.8722255 46.011853,15.3025577 L42.4602004,4.98780957 C42.264048,4.41814176 42.5668421,3.79732185 43.13651,3.6011695 C43.7061778,3.40501714 44.3269977,3.70781124 44.52315,4.27747905 Z M78.7017991,1.61738211 C79.2888497,1.75291342 79.6548784,2.33868181 79.5193471,2.92573242 L77.0653356,13.555224 C76.9298043,14.1422746 76.3440359,14.5083034 75.7569853,14.372772 C75.1699347,14.2372407 74.803906,13.6514723 74.9394373,13.0644217 L77.3934488,2.43493012 C77.5289801,1.84787951 78.1147485,1.4818508 78.7017991,1.61738211 Z M51.333824,2.43493012 L53.7878355,13.0644217 C53.9233668,13.6514723 53.5573381,14.2372407 52.9702874,14.372772 C52.3832368,14.5083034 51.7974684,14.1422746 51.6619371,13.555224 L49.2079256,2.92573242 C49.0723943,2.33868181 49.438423,1.75291342 50.0254736,1.61738211 C50.6125243,1.4818508 51.1982926,1.84787951 51.333824,2.43493012 Z M71.5214051,0.399405276 C72.120597,0.462382887 72.5552846,0.999177366 72.492307,1.5983693 L71.3519965,12.4476991 C71.2890189,13.046891 70.7522244,13.4815786 70.1530325,13.418601 C69.5538406,13.3556234 69.119153,12.8188289 69.1821306,12.219637 L70.3224411,1.3703072 C70.3854187,0.771115265 70.9222132,0.336427666 71.5214051,0.399405276 Z M58.4048316,1.3703072 L59.5451422,12.219637 C59.6081198,12.8188289 59.1734322,13.3556234 58.5742402,13.418601 C57.9750483,13.4815786 57.4382538,13.046891 57.3752762,12.4476991 L56.2349657,1.5983693 C56.1719881,0.999177366 56.6066757,0.462382887 57.2058676,0.399405276 C57.8050596,0.336427666 58.341854,0.771115265 58.4048316,1.3703072 Z M64.3636364,0 C64.9661288,-1.10676068e-16 65.4545455,0.488416637 65.4545455,1.09090909 L65.4545455,12 C65.4545455,12.6024925 64.9661288,13.0909091 64.3636364,13.0909091 C63.7611439,13.0909091 63.2727273,12.6024925 63.2727273,12 L63.2727273,1.09090909 C63.2727273,0.488416637 63.7611439,1.10676068e-16 64.3636364,0 Z"
            id="形状结合"
          ></path>
        </g>
      </svg>
      <div className={styles.progressCircle_text}>{props.percent || 0}</div>
    </div>
  );
};

export default index;
