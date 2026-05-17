export const site = {
  name: "지에이코리아 웨스턴지사",
  shortName: "GA Korea Western",
  tagline: "고객의 미래를 함께 설계하는 보험 파트너",
  description:
    "지에이코리아 웨스턴지사 - 생명·건강·자동차·사업자·연금 보험 상담 및 설계. 서울 강서구 소재 GA(General Agency) 보험대리점.",

  contact: {
    phone: "02-1234-5678",
    phoneHref: "tel:+82212345678",
    email: "contact@gakorea-western.com",
    kakaoChannelId: null as string | null,
    address: "서울 강서구 강서로 183 대사빌딩 4층",
    addressShort: "서울 강서구 강서로 183",
    naverMapUrl: "https://map.naver.com/p/entry/place/1880453637",
  },

  business: {
    representative: "홍길동",
    registrationNumber: "000-00-00000",
    insuranceAgencyNumber: "0000000000",
  },

  hours: {
    weekday: "평일 09:00 - 18:00",
    lunch: "점심시간 12:00 - 13:00",
    weekend: "주말 및 공휴일 휴무",
  },

  social: {
    naverPlace: null as string | null,
    instagram: null as string | null,
    blog: null as string | null,
  },

  partners: {
    life: [
      { name: "삼성생명", slug: "samsung-life", domain: "samsunglife.com" },
      { name: "한화생명", slug: "hanwha-life", domain: "hanwhalife.com" },
      { name: "교보생명", slug: "kyobo", domain: "kyobo.co.kr" },
      { name: "신한라이프", slug: "shinhan-life", domain: "shinhanlife.com" },
      { name: "KB라이프", slug: "kb-life", domain: "kbli.co.kr" },
      { name: "NH농협생명", slug: "nh-life", domain: "nhlife.co.kr" },
      { name: "미래에셋생명", slug: "miraeasset-life", domain: "miraeassetlife.com" },
      { name: "동양생명", slug: "dongyang-life", domain: "myangel.co.kr" },
      { name: "흥국생명", slug: "heungkuk-life", domain: "heungkuklife.com" },
      { name: "메트라이프", slug: "metlife", domain: "metlife.co.kr" },
      { name: "AIA생명", slug: "aia", domain: "aia.co.kr" },
      { name: "푸르덴셜생명", slug: "prudential", domain: "prudential.co.kr" },
      { name: "라이나생명", slug: "chubb-life", domain: "chubblife.co.kr" },
      { name: "ABL생명", slug: "abl-life", domain: "abllife.co.kr" },
    ],
    nonlife: [
      { name: "삼성화재", slug: "samsung-fire", domain: "samsungfire.com" },
      { name: "현대해상", slug: "hyundai-marine", domain: "hi.co.kr" },
      { name: "DB손해보험", slug: "db-ins", domain: "idbins.com" },
      { name: "KB손해보험", slug: "kb-ins", domain: "kbinsure.co.kr" },
      { name: "메리츠화재", slug: "meritz-fire", domain: "meritzfire.com" },
      { name: "한화손해보험", slug: "hanwha-ins", domain: "hwgeneralins.com" },
      { name: "롯데손해보험", slug: "lotte-ins", domain: "lotteins.co.kr" },
      { name: "NH농협손해보험", slug: "nh-fire", domain: "nhfire.co.kr" },
      { name: "흥국화재", slug: "heungkuk-fire", domain: "heungkukfire.co.kr" },
      { name: "AXA손해보험", slug: "axa", domain: "axa.co.kr" },
      { name: "MG손해보험", slug: "mg-ins", domain: "mggeneralins.com" },
      { name: "캐롯손해보험", slug: "carrot-ins", domain: "carrotins.com" },
    ],
  },

  url: "https://gakorea-western.com",
} as const;

export type Site = typeof site;
