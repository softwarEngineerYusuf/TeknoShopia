export interface MenuItem {
  id: number;
  title: string;
  listItems: ListItem[];
}

export interface ListItem {
  id: number;
  title: string;
  url: string;
  icon: string;
}
export interface topList {
  id: number;
  img: string;
  username: string;
  email: string;
  amount: string;
}

export const menuData = [
  {
    id: 1,
    title: "Main",
    listItems: [
      {
        id: 1,
        title: "Homepage",
        url: "/",
        icon: "home.svg",
      },
      {
        id: 2,
        title: "Profile",
        url: "users/1",
        icon: "user.svg",
      },
    ],
  },

  {
    id: 2,
    title: "Lists",
    listItems: [
      {
        id: 1,
        title: "Users",
        url: "/users",
        icon: "user.svg",
      },
      {
        id: 2,
        title: "Products",
        url: "/products",
        icon: "product.svg",
      },
      {
        id: 3,
        title: "Orders",
        url: "/orders",
        icon: "order.svg",
      },
      {
        id: 4,
        title: "Posts",
        url: "/posts",
        icon: "post2.svg",
      },
    ],
  },

  {
    id: 3,
    title: "General",
    listItems: [
      {
        id: 1,
        title: "Elements",
        url: "/",
        icon: "element.svg",
      },
      {
        id: 2,
        title: "Notes",
        url: "/",
        icon: "note.svg",
      },
      {
        id: 3,
        title: "Forms",
        url: "/",
        icon: "form.svg",
      },
      {
        id: 4,
        title: "Calendar",
        url: "/",
        icon: "calendar.svg",
      },
    ],
  },

  {
    id: 4,
    title: "Maintenance",
    listItems: [
      {
        id: 1,
        title: "Settings",
        url: "/",
        icon: "setting.svg",
      },
      {
        id: 2,
        title: "Backups",
        url: "/",
        icon: "backup.svg",
      },
    ],
  },
  {
    id: 5,
    title: "Analytics",
    listItems: [
      {
        id: 1,
        title: "Charts",
        url: "/",
        icon: "chart.svg",
      },
      {
        id: 2,
        title: "Logs",
        url: "/",
        icon: "log.svg",
      },
    ],
  },
];

export const topDealUsers = [
  {
    id: 1,
    img: "https://mui.com/static/images/avatar/3.jpg",
    username: "Elva McDonald",
    email: "elva@gmail.com",
    amount: "3.668",
  },
  {
    id: 2,
    img: "https://mui.com/static/images/avatar/3.jpg",
    username: "Elva McDonald",
    email: "elva@gmail.com",
    amount: "3.668",
  },
  {
    id: 3,
    img: "https://mui.com/static/images/avatar/3.jpg",
    username: "Elva McDonald",
    email: "elva@gmail.com",
    amount: "3.668",
  },
  {
    id: 4,
    img: "https://mui.com/static/images/avatar/3.jpg",
    username: "Elva McDonald",
    email: "elva@gmail.com",
    amount: "3.668",
  },
  {
    id: 5,
    img: "https://mui.com/static/images/avatar/3.jpg",
    username: "Elva McDonald",
    email: "elva@gmail.com",
    amount: "3.668",
  },
];

export const chartBoxUser = {
  color: "#8884d8",
  icon: "userIcon.svg",
  title: "Total Users",
  number: "11.238",
  dataKey: "users",
  percentage: 45,
  chartData: [
    {
      name: "Sun",
      users: 400,
    },
    {
      name: "Mon",
      users: 600,
    },
    {
      name: "Tue",
      users: 500,
    },
    {
      name: "Wed",
      users: 700,
    },
    {
      name: "Thu",
      users: 400,
    },
    {
      name: "Fri",
      users: 500,
    },
    {
      name: "Sat",
      users: 450,
    },
  ],
};

export const chartBoxProduct = {
  color: "skyblue",
  icon: "userIcon.svg",
  title: "Total Products",
  number: "238",
  dataKey: "products",
  percentage: 21,
  chartData: [
    {
      name: "Sun",
      users: 400,
    },
    {
      name: "Mon",
      users: 600,
    },
    {
      name: "Tue",
      users: 500,
    },
    {
      name: "Wed",
      users: 700,
    },
    {
      name: "Thu",
      users: 400,
    },
    {
      name: "Fri",
      users: 500,
    },
    {
      name: "Sat",
      users: 450,
    },
  ],
};

export const chartBoxRevenue = {
  color: "teal",
  icon: "userIcon.svg",
  title: "Total Revenue",
  number: "$56.435",
  dataKey: "revenue",
  percentage: 45,
  chartData: [
    {
      name: "Sun",
      users: 400,
    },
    {
      name: "Mon",
      users: 600,
    },
    {
      name: "Tue",
      users: 500,
    },
    {
      name: "Wed",
      users: 700,
    },
    {
      name: "Thu",
      users: 400,
    },
    {
      name: "Fri",
      users: 500,
    },
    {
      name: "Sat",
      users: 450,
    },
  ],
};

export const chartBoxConversion = {
  color: "gold",
  icon: "userIcon.svg",
  title: "Total Ratio",
  number: "2.6",
  dataKey: "ratio",
  percentage: -12,
  chartData: [
    {
      name: "Sun",
      ratio: 400,
    },
    {
      name: "Mon",
      ratio: 600,
    },
    {
      name: "Tue",
      ratio: 500,
    },
    {
      name: "Wed",
      ratio: 700,
    },
    {
      name: "Thu",
      ratio: 400,
    },
    {
      name: "Fri",
      ratio: 500,
    },
    {
      name: "Sat",
      ratio: 450,
    },
  ],
};

export const barChartBoxRevenue = {
  title: "Profit Earned",
  color: "#8884d8",
  dataKey: "visit",
  chartData: [
    {
      name: "Sun",
      visit: 4000,
    },
    {
      name: "Mon",
      visit: 3000,
    },
    {
      name: "Tue",
      visit: 2000,
    },
    {
      name: "Wed",
      visit: 2789,
    },
    {
      name: "Thu",
      visit: 2780,
    },
    {
      name: "Fri",
      visit: 2548,
    },
    {
      name: "Sat",
      visit: 3498,
    },
  ],
};

export const barChartBoxVisit = {
  title: "Total Visit",
  color: "#FF8042",
  dataKey: "visit",
  chartData: [
    {
      name: "Sun",
      visit: 4000,
    },
    {
      name: "Mon",
      visit: 3000,
    },
    {
      name: "Tue",
      visit: 2000,
    },
    {
      name: "Wed",
      visit: 2789,
    },
    {
      name: "Thu",
      visit: 2780,
    },
    {
      name: "Fri",
      visit: 2548,
    },
    {
      name: "Sat",
      visit: 3498,
    },
  ],
};

export const userRows = [
  {
    id: 1,
    img: "",
    firstName: "Hubbard",
    lastName: "Eula",

    email: "kewez@gmail.com",
    phone: "123545685",
    CreatedAt: "01.02.2023",
    verified: true,
  },
  {
    id: 2,
    img: "",
    firstName: "Hubbard",
    lastName: "Eula",

    email: "kewez@gmail.com",
    phone: "123545685",
    CreatedAt: "01.02.2023",
    verified: true,
  },
  {
    id: 3,
    img: "",
    firstName: "Hubbard",
    lastName: "Eula",

    email: "kewez@gmail.com",
    phone: "123545685",
    CreatedAt: "01.02.2023",
    verified: true,
  },
  {
    id: 4,
    img: "",
    firstName: "Hubbard",
    lastName: "Eula",

    email: "kewez@gmail.com",
    phone: "123545685",
    CreatedAt: "01.02.2023",
    verified: true,
  },
  {
    id: 5,
    img: "",
    firstName: "Hubbard",
    lastName: "Eula",

    email: "kewez@gmail.com",
    phone: "123545685",
    CreatedAt: "01.02.2023",
    verified: true,
  },
  {
    id: 6,
    img: "",
    firstName: "Hubbard",
    lastName: "Eula",

    email: "kewez@gmail.com",
    phone: "123545685",
    CreatedAt: "01.02.2023",
    verified: true,
  },
  {
    id: 7,
    img: "",
    firstName: "Hubbard",
    lastName: "Eula",

    email: "kewez@gmail.com",
    phone: "123545685",
    CreatedAt: "01.02.2023",
    verified: true,
  },
];

export const productRow = [
  {
    id: 1,
    img: "",
    title: "Logitech MX Master 3",
    color: "black",
    producer: "Logitech",
    price: "$59.49",
    CreatedAt: "01.02.2023",
    inStock: true,
  },
  {
    id: 2,
    img: "",
    title: "Logitech MX Master 3",
    color: "black",
    producer: "Logitech",
    price: "$59.49",
    CreatedAt: "01.02.2023",
    inStock: true,
  },
  {
    id: 3,
    img: "",
    title: "Logitech MX Master 3",
    color: "black",
    producer: "Logitech",
    price: "$59.49",
    CreatedAt: "01.02.2023",
    inStock: true,
  },
  {
    id: 4,
    img: "",
    title: "Logitech MX Master 3",
    color: "black",
    producer: "Logitech",
    price: "$59.49",
    CreatedAt: "01.02.2023",
    inStock: true,
  },
  {
    id: 5,
    img: "",
    title: "Logitech MX Master 3",
    color: "black",
    producer: "Logitech",
    price: "$59.49",
    CreatedAt: "01.02.2023",
    inStock: true,
  },
  {
    id: 6,
    img: "",
    title: "Logitech MX Master 3",
    color: "black",
    producer: "Logitech",
    price: "$59.49",
    CreatedAt: "01.02.2023",
    inStock: true,
  },
];

export const singleUser ={
  id:1,
  title:"John Doe",
  img:"",
  info:{
    username:"Johndoe99",
    fullname:"John Doe",
    email:"john@gmail.com",
    producer:"123 564 587",
    status:"verified",

  }
}

export const singleProduct ={
  id:1,
  title:"Playstation 5 Digital Edition",
  img:"",
  info:{
    productId:"Ps55DF1156d",
    color:"white",
    price:"$250.99",
    producer:"Sony",
    export:"Japan"

  }
}
