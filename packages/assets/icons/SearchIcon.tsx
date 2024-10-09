import Icon from '@ant-design/icons';
import type { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';

const SearchIconSVG = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={11} height={12} viewBox="0 0 11 12" fill="none">
      <circle cx={5} cy={5} r={4.3} stroke="#2A3FFC" strokeWidth={1.4} />
      <path stroke="#2A3FFC" strokeWidth={1.4} strokeLinecap="round" d="M10.0101 11L8 8.98995" />
    </svg>
  );
};

export const SearchIcon = (props: Partial<CustomIconComponentProps>) => {
  return <Icon component={SearchIconSVG} {...props} />;
};
