import Icon from '@ant-design/icons';
import { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';

const LogoutIconSVG = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={21} height={21} viewBox="0 0 21 21" fill="none">
      <path
        d="M6.343 2.163a2.47 2.47 0 00-2.47 2.47v11.53a2.47 2.47 0 002.47 2.471h8.236a2.47 2.47 0 002.47-2.47v-.824a.824.824 0 00-1.647 0v.823a.823.823 0 01-.823.824H6.343a.823.823 0 01-.823-.823V4.633a.824.824 0 01.823-.824h8.236a.823.823 0 01.823.824v.823a.824.824 0 101.647 0v-.823a2.47 2.47 0 00-2.47-2.471H6.343z"
        fill="#D55F5A"
      />
      <path
        d="M14.338 7.345a.824.824 0 10-1.165 1.165l1.065 1.065H10.46a.824.824 0 000 1.647h3.777l-1.065 1.065a.823.823 0 101.165 1.165l2.47-2.471a.824.824 0 000-1.165l-2.47-2.47z"
        fill="#D55F5A"
      />
    </svg>
  );
};
export const LogoutIcon = (props: Partial<CustomIconComponentProps>) => {
  return <Icon component={LogoutIconSVG} {...props} />;
};
