import { RotatingLines } from 'react-loader-spinner';

import styles from '../styles/CustomLoader.module.scss';

const CustomLoader = ({ isLoading }) => {

  return (
    <div className={styles["loader-container"]}>
      <RotatingLines
        visible={isLoading}
        height="96"
        width="96"
        color="grey"
        strokeWidth="5"
        animationDuration="0.75"
        ariaLabel="rotating-lines-loading"
        wrapperStyle={{}}
        wrapperClass={styles["loader-class"]}
      />
    </div>
  );
};

export default CustomLoader;
