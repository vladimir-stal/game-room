'use client';

import ReactSelect from 'react-select';

type SelectType = {
  value: string;
  label: string;
};

type SelectProps = {
  options: SelectType[];
  name: string;
};

const Select = ({ options, name }: SelectProps) => {
  return <ReactSelect name={name} options={options} />;
};

export default Select;
