import { MyInfoType } from '../types';

const Socials = ({ MyInfo }: { MyInfo: MyInfoType }) => {
  return (
    <div className="mt-5 w-full flex justify-between gap-2">
      <a
        className="opacity-70 hover:opacity-100 flex gap-2 transition-opacity duration-[0.6s]"
        href={MyInfo.contacts.socials.telegram}
      >
        <i className="bi text-3xl bi-telegram"></i>
      </a>
      <a
        className="opacity-70 hover:opacity-100 flex gap-2 transition-opacity duration-[0.6s]"
        href={MyInfo.contacts.socials.linkedin}
      >
        <i className="bi text-3xl bi-linkedin"></i>
      </a>
      <a
        className="opacity-70 hover:opacity-100 flex gap-2 transition-opacity duration-[0.6s]"
        href={MyInfo.contacts.socials.instagram}
      >
        <i className="bi text-3xl bi-instagram"></i>
      </a>
      <a
        className="opacity-70 hover:opacity-100 flex gap-2 transition-opacity duration-[0.6s]"
        href={MyInfo.contacts.socials.github}
      >
        <i className="bi text-3xl bi-github"></i>
      </a>
    </div>
  );
};

export default Socials;
