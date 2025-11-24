import React from "react";

let data = [
  {
    productUrl:
      "https://img.cdnx.in/369140/cat/374737_cat-1730014260118.png?width=384&format=webp",
    productName: "AIR FORCE",
  },
  {
    productUrl:
      "https://img.cdnx.in/369140/cat/374737_cat-1720513412444.jpg?width=384&format=webp",
    productName: "LOW DUNK",
  },
  {
    productUrl:
      "https://img.cdnx.in/369140/cat/374737_cat-1724783372901.jpg?width=384&format=webp",
    productName: "TRAVIS SCOTT",
  },
  {
    productUrl:
      "https://img.cdnx.in/369140/cat/374737_cat-1720513384684.jpg?width=384&format=webp",
    productName: "JORDAN",
  },
  {
    productUrl:
      "https://img.cdnx.in/369140/cat/374737_cat-1721248668584.jpg?width=384&format=webp",
    productName: "RETRO",
  },
  {
    productUrl:
      "https://img.cdnx.in/369140/cat/374737_cat-1730014788394.png?width=384&format=webp",
    productName: "SAMBA",
  },
];

function ProductCard() {
  return (
    <>
        <div className=" grid grid-cols-3 gap-8 text-center mt-5  ">
      {data.map((data, index) => (
          <div key={index} className="h-[30rem]">
            <img
              className=" p-3 rounded-lg shadow-md border-zinc-200"
              src={data.productUrl}
              alt=""
            />
            <p className="mt-5">{data.productName}</p>
          </div>
      ))}
      </div>
    </>
  );
}

export default ProductCard;
