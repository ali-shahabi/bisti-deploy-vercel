import Card from "@/components/common/Card";
import PageHeader from "@/components/common/PageHeader";
import PrivateLayout from "@/components/layouts/PrivateLayout";
import { ReactElement } from "react";
export default function Custom404() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3  2xl:grid-cols-6  gap-4">
      <PageHeader />
      404
    </div>
  );
}

Custom404.getLayout = function getLayout(page: ReactElement) {
  return <PrivateLayout>{page}</PrivateLayout>;
};
