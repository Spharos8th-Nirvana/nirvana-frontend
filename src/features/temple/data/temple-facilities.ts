export type TempleFacility = {
  id: number;
  templeId: number;
  name: string;
  description: string;
  image: string;
};

export const templeFacilities: TempleFacility[] = [
  {
    id: 1,
    templeId: 1,
    name: "숙박 공간",
    description: "편안한 휴식을 위한 숙박 공간입니다.",
    image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739",
  },
  {
    id: 2,
    templeId: 1,
    name: "명상 공간",
    description: "조용히 마음을 돌아볼 수 있는 공간입니다.",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773",
  },
  {
    id: 3,
    templeId: 1,
    name: "휴식 공간",
    description: "자연을 바라보며 여유를 즐길 수 있는 공간입니다.",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
  },
];
