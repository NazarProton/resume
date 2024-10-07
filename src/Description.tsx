import { MyInfoType } from './types';

const Description = ({
  MyInfo,
  isForSmallScreen,
}: {
  MyInfo: MyInfoType;
  isForSmallScreen?: boolean;
}) => {
  return (
    <p className={`mt-10 ${isForSmallScreen ? 'pc700:hidden' : ''}`}>
      👋 {MyInfo.profile.description}
      <br />
      {MyInfo.profile.description2}
      <br />
      {MyInfo.profile.description3}
      <br />
      {MyInfo.profile.description4}
      <br />
      {MyInfo.profile.description5}
    </p>
  );
};

export default Description;
