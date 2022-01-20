import { BaseSyntheticEvent, ReactElement, useState } from "react";
import { GetStaticProps } from "next";
import axios from "axios";

import PrivateLayout from "@/components/layouts/PrivateLayout";
import { Parameter, Rule, SubParameter } from "@/shared/interfaces";
import { BASE_URL } from "@/shared/constants";
import { Select, Input, Option, PageHeader } from "@/components/common";

export const getStaticProps: GetStaticProps = async () => {
  const { data: parameters } = await axios.get(`${BASE_URL}parameter/list`);
  const { data: subParameters } = await axios.get(
    `${BASE_URL}sub-parameter/list`
  );
  const { data: rules } = await axios.get(`${BASE_URL}rule-parameter/list`);

  return {
    props: {
      data: {
        parameters: parameters.response,
        subParameters: subParameters.response,
        rules: rules.response,
      },
    },
    revalidate: 1,
  };
};

type Data = {
  parameters: Parameter[];
  subParameters: SubParameter[];
  rules: Rule[];
};

type Props = {
  data: Data;
};

export default function ConvertPage({ data }: Props) {
  const [parameter, setParameter] = useState();
  console.log(data);

  const handleParameterChange = (e: BaseSyntheticEvent) => {
    console.log(e.target.value);
  };

  const handleSubParameterOneChange = (e: BaseSyntheticEvent) => {
    console.log(e.target.value);
  };

  const handleSubParameterTwoChange = (e: BaseSyntheticEvent) => {
    console.log(e.target.value);
  };

  return (
    <div className="px-40 flex justify-center">
      <PageHeader />
      <div className="w-[60%] grid grid-cols-1 gap-y-4">
        <Select onChange={handleParameterChange}>
          {data.parameters.map((item, index) => (
            <Option value={item.id} key={index}>
              {item.name}
            </Option>
          ))}
        </Select>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid grid-cols- gap-y-4">
            <Input dir="ltr" type="number" />
            <Select onChange={handleSubParameterOneChange}>
              {data.subParameters.map((item, index) => (
                <Option value={item.id} key={index}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </div>
          <div className="grid grid-cols- gap-y-4">
            <Input dir="ltr" type="number" />
            <Select onChange={handleSubParameterTwoChange}>
              {data.subParameters.map((item, index) => (
                <Option value={item.id} key={index}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </div>
        </div>
        <div>
          <p>
            <span>فرمول:</span>
          </p>
        </div>
      </div>
    </div>
  );
}

ConvertPage.getLayout = function getLayout(page: ReactElement) {
  return <PrivateLayout>{page}</PrivateLayout>;
};
