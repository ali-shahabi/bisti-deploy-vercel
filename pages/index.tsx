import Card from "@/components/common/Card";
import PageHeader from "@/components/common/PageHeader";
import PrivateLayout from "@/components/layouts/PrivateLayout";
import { GetStaticProps } from "next";
import { ReactElement } from "react";
import axios from "axios";
import { BASE_URL } from "@/shared/constants";
import { CategoryItem } from "@/shared/interfaces";

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await axios.get(`${BASE_URL}category/list?parentId=0`);

  return { props: { data: data.response } };
};

type Props = { data: CategoryItem[] };

export default function Home({ data }: Props) {
  console.log(data);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3  2xl:grid-cols-6  gap-4">
      <PageHeader />
      {data.map((item: CategoryItem, index) => (
        <Card
          key={index}
          data={item}
          href={
            item.typeId !== 4
              ? item.page?.slug
                ? `/page/${item.page?.slug}`
                : `/category/${item?.slug}`
              : `/convert`
          }
        />
      ))}
    </div>
  );
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <PrivateLayout>{page}</PrivateLayout>;
};
