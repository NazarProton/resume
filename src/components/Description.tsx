import { MyInfoType } from '../types';

const Description = ({
  MyInfo,
  isForSmallScreen,
}: {
  MyInfo: MyInfoType;
  isForSmallScreen?: boolean;
}) => {
  return (
    <p className={`mt-5 ${isForSmallScreen ? 'pc700:hidden' : ''}`}>
      {MyInfo.profile.description}
      <br />
    </p>
  );
};

export default Description;
