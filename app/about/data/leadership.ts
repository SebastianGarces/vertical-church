export interface LeadershipMember {
  name: string;
  role: string;
  image: string;
}

export interface Elder {
  name: string;
  role: string;
  image: string;
  church?: string;
  churchUrl?: string;
}

export interface SmallGroupLeader {
  names: string;
  image: string;
}

export interface LeadershipData {
  staff: LeadershipMember[];
  leadership: LeadershipMember[];
  elders: Elder[];
  smallGroupLeaders: SmallGroupLeader[];
}

export const leadership: LeadershipData = {
  staff: [
    {
      name: 'Bryan Nass',
      role: 'Senior Pastor & Lead Elder',
      image: 'https://vertical-church.t3.storage.dev/bryan-nass.jpg',
    },
    {
      name: 'Tiffany Fairbairn',
      role: 'Director of Connections and Communications',
      image: 'https://vertical-church.t3.storage.dev/tiffany-fairbairn.jpg',
    },
  ],
  leadership: [
    {
      name: 'Cory Tutor',
      role: 'Small Group Coordinator',
      image: 'https://vertical-church.t3.storage.dev/cory-tutor.jpg',
    },
    {
      name: 'McKenna Roose',
      role: 'Kids Ministry Coordinator',
      image: 'https://vertical-church.t3.storage.dev/mckenna-roose.jpg',
    },
    {
      name: 'Jenna Harbaugh',
      role: 'Worship Ministry Coordinator',
      image: 'https://vertical-church.t3.storage.dev/jenna-harbaugh.jpg',
    },
    {
      name: 'Sara Nass',
      role: "Women's Ministry Coordinator",
      image: 'https://vertical-church.t3.storage.dev/sara-nass.jpg',
    },
    {
      name: 'Dave Nass',
      role: "Men's Ministry Coordinator",
      image: 'https://vertical-church.t3.storage.dev/dave-nass.jpg',
    },
    {
      name: 'David Fairbairn',
      role: 'Finance Team Chair',
      image: 'https://vertical-church.t3.storage.dev/david-fairbairn.jpg',
    },
  ],
  elders: [
    {
      name: 'Bryan Nass',
      role: 'Lead Elder',
      image: 'https://vertical-church.t3.storage.dev/bryan-nass.jpg',
    },
    {
      name: 'Luke Ahrens',
      role: 'Senior Pastor',
      image: 'https://vertical-church.t3.storage.dev/luke-ahrens.jpeg',
      church: 'Vertical Church Columbus',
      churchUrl: 'https://www.verticalchurch.life/',
    },
    {
      name: 'Dan Ghramm',
      role: 'Senior Pastor',
      image: 'https://vertical-church.t3.storage.dev/dan-ghramm.png',
      church: 'Gateway Church North Eaton',
      churchUrl: 'https://gateway.tv/',
    },
  ],
  smallGroupLeaders: [
    { names: 'Dave & Mary Nass', image: 'https://vertical-church.t3.storage.dev/dave-mary-nass.jpg' },
    { names: 'Bryan & Sara Nass', image: 'https://vertical-church.t3.storage.dev/bryan-sara-nass.jpg' },
    { names: 'Corey & Jen Tutor', image: 'https://vertical-church.t3.storage.dev/corey-jen-tutor.jpg' },
    { names: 'Visobe Welch-Burnett', image: 'https://vertical-church.t3.storage.dev/visobe-welch-burnett.jpg' },
  ],
};
