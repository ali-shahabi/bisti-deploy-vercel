import React, { FC } from "react";
import Image from "next/image";
import Link from "next/link";

import { Card } from "@/shared/interfaces";
import { IMAGE_URL } from "@/shared/constants";

const Card: FC<Card> = ({ className = "", data, href }) => {
  return (
    <>
      <Link href={href}>
        <a>
          <div
            className={`category-card text-white  h-[350px] w-full bg-no-repeat bg-center bg-contain relative rounded-2xl overflow-hidden flex flex-col justify-end items-end p-4 group ${className}`}
          >
            <Image
              alt={data.title}
              src={IMAGE_URL + data.fileImage?.name}
              layout="fill"
              objectFit="contain"
              className="group-hover:scale-110 transition-all duration-500"
            />
            <div className="w-full transition-all duration-500 translate-y-[100%] group-hover:translate-y-0 mb-[50px] group-hover:mb-[10px]">
              <h3 className="text-3xl transition-all mb-2 duration-500 ">
                {data.title}
              </h3>
              <p className="text-lg transition-all duration-500 opacity-0 group-hover:opacity-100">
                {data.content}
              </p>
            </div>
            <div className="h-[30px] flex flex-col w-full z-10">
              <hr />
              <p className="w-[300px] truncate">{data.subtitle}</p>
            </div>
          </div>
        </a>
      </Link>
      <style scoped jsx>{`
        .category-card {
          background-color: ${data.color};
        }
      `}</style>
    </>
  );
};

export default Card;
