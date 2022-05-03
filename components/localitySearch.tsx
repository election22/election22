import { Text } from "@chakra-ui/react";
import axios from "axios";
import {
  AsyncSelect,
  OptionBase,
  GroupBase,
  ActionMeta,
  OptionProps,
  components,
} from "chakra-react-select";
import debounce from "lodash.debounce";
import React from "react";
import { LocalityResult } from "../pages/api/localitySearch";

interface LocalityResultOption extends OptionBase {
  label: string;
  value: string;
  electorate: string;
}

async function search(locality) {
  const res = await axios.get<LocalityResult[]>(
    `/api/localitySearch?locality=${locality}`
  );
  const { data } = res;
  return data;
}

const Option: React.FC<OptionProps<LocalityResultOption>> = (props) => {
  return (
    <components.Option {...props}>
      <Text>{props.label}</Text>
      <Text fontSize={"small"}>{props.data.electorate}</Text>
    </components.Option>
  );
};

interface LocalitySearchProps {
  placeholder?: string;
  name: string;
  onChange: (
    newValue: LocalityResultOption,
    actionMeta: ActionMeta<LocalityResultOption>
  ) => void;
}

export const LocalitySearch: React.FC<LocalitySearchProps> = ({
  name,
  onChange,
  placeholder,
}) => {
  const loadOptions = React.useCallback(
    debounce((inputValue, callback) => {
      search(inputValue).then((res) => {
        const values = res.map((i) => ({
          label: `${i.name} (${i.postcode})`,
          value: i.name,
          electorate: i.electorate,
        }));
        callback(values);
      });
    }, 500),
    []
  );

  return (
    <AsyncSelect<LocalityResultOption, false, GroupBase<LocalityResultOption>>
      name={name}
      placeholder={placeholder}
      onChange={onChange}
      loadOptions={loadOptions}
      components={{ Option }}
      noOptionsMessage={({ inputValue }) => {
        if (inputValue) {
          if (Number(inputValue)) {
            return "Enter your suburb name, not your postcode";
          }
          return "No results found";
        }
        return "Enter a suburb or locality";
      }}
    />
  );
};
