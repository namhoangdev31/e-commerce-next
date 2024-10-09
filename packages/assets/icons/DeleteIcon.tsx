import Icon from '@ant-design/icons';
import { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';

const DeleteIconSVG = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={25} height={24} viewBox="0 0 25 24" fill="none">
      <path
        d="M21.125 5.98c-3.33-.33-6.68-.5-10.02-.5-1.98 0-3.96.1-5.94.3l-2.04.2M8.625 4.97l.22-1.31c.16-.95.28-1.66 1.97-1.66h2.62c1.69 0 1.82.75 1.97 1.67l.22 1.3M18.975 9.14l-.65 10.07c-.11 1.57-.2 2.79-2.99 2.79h-6.42c-2.79 0-2.88-1.22-2.99-2.79l-.65-10.07M10.455 16.5h3.33M9.625 12.5h5"
        stroke="#5B8DEF"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const DeleteIcon = (props: Partial<CustomIconComponentProps>) => {
  return <Icon component={DeleteIconSVG} {...props} />;
};
