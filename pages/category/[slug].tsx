import { ReactElement } from "react";
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import axios from "axios";

import { Card, PageHeader } from "@/components/common";
import PrivateLayout from "@/components/layouts/PrivateLayout";
import { CategoryItem, Slug } from "@/shared/interfaces";
import { BASE_URL } from "@/shared/constants";

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await axios.get(`${BASE_URL}category/list`);

  const paths = data?.response?.map((item: CategoryItem) => {
    return {
      params: {
        slug: item.slug.toString(),
      },
    };
  });

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const { slug } = context.params as Slug;
  console.log(`slug${slug}`);
  const { data } = await axios.get(
    `${BASE_URL}category/list?parentSlug=${slug}`
  );

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      data: data.response,

      slug: slug,
    },
    revalidate: 1,
  };
};

type Props = {
  data: CategoryItem[];
  slug: string[];
};

export default function CategoryPage({ data, slug }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3  2xl:grid-cols-6  gap-4">
      <PageHeader />
      {data.map((item: CategoryItem, index: number) => (
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

CategoryPage.getLayout = function getLayout(page: ReactElement) {
  return <PrivateLayout>{page}</PrivateLayout>;
};
