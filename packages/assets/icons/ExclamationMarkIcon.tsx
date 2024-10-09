import Icon from '@ant-design/icons';
import type { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';

const ExclamationMarkSVG = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={20} height={21} viewBox="0 0 20 21" fill="none">
      <path
        d="M9 5.5h2v2H9v-2zm1 10c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1s-1 .45-1 1v4c0 .55.45 1 1 1zm0-15C4.48.5 0 4.98 0 10.5s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
        fill="#5B8DEF"
      />
    </svg>
  );
};

export const ExclamationMarkIcon = (props: Partial<CustomIconComponentProps>) => {
  return <Icon component={ExclamationMarkSVG} {...props} />;
};
