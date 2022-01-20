import PageHeader from "@/components/common/PageHeader";
import PrivateLayout from "@/components/layouts/PrivateLayout";
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import { ReactElement } from "react";

import { PageItem, Slug } from "@/shared/interfaces";
import { BASE_URL } from "@/shared/constants";
import axios from "axios";

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await axios.get(`${BASE_URL}page/list`);

  const paths = data?.response?.map((item: PageItem) => {
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
  const { data } = await axios.get(`${BASE_URL}page/list?slug=${slug}`);

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
  data: PageItem[];
  slug: string[];
};

export default function Page({ data, slug }: Props) {
  console.log(data, slug);
  return (
    <div className="">
      <PageHeader />
      {data?.map((item: PageItem, index) => (
        <div key={index} dangerouslySetInnerHTML={{ __html: item.content }} />
      ))}
    </div>
  );
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <PrivateLayout>{page}</PrivateLayout>;
};
