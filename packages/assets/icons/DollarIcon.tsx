import Icon from '@ant-design/icons';
import { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';

const DollarIconSVG = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={21} height={21} viewBox="0 0 21 21" fill="none">
      <path
        d="M7.805 12.926c0 1.075.825 1.941 1.85 1.941h2.091c.892 0 1.617-.758 1.617-1.691 0-1.017-.442-1.375-1.1-1.608L8.905 10.4c-.659-.233-1.1-.592-1.1-1.608 0-.934.725-1.692 1.616-1.692h2.092c1.025 0 1.85.867 1.85 1.942M10.578 5.984v10"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.578 19.318a8.333 8.333 0 100-16.667 8.333 8.333 0 000 16.667z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const DollarIcon = (props: Partial<CustomIconComponentProps>) => {
  return <Icon component={DollarIconSVG} {...props} />;
};
