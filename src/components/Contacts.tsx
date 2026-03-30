import { MyInfoType } from '../types';

const Contacts = ({ MyInfo, title }: { MyInfo: MyInfoType; title: string }) => {
  return (
    <div className="w-full flex justify-center gap-2 flex-col">
      <h3 className="text-xl text-orange-500">{title}</h3>
      <a
        className="hover:opacity-100 opacity-70 flex gap-2  transition-opacity duration-[0.6s]"
        href={`tel:${MyInfo.contacts.phone}`}
      >
        <i className="bi bi-telephone-fill"></i>
        {MyInfo.contacts.phone}
      </a>
      <a
        className="hover:opacity-100 opacity-70 flex gap-2 transition-opacity duration-[0.6s]"
        href={`mailto:${MyInfo.contacts.email}`}
      >
        <i className="bi bi-envelope-fill"></i>
        {MyInfo.contacts.email}
      </a>
      <a
        target="_blank"
        rel="noopener noreferrer"
        className="hover:opacity-100 opacity-70 flex gap-2 transition-opacity duration-[0.6s]"
        href={`${MyInfo.contacts.locationLink}`}
      >
        <i className="bi bi-geo-alt-fill"></i>
        {MyInfo.contacts.location}
      </a>
    </div>
  );
};

export default Contacts;
