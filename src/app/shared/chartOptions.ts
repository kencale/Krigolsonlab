export const chartStyles = {
  wrapperStyle: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: '20px'
  }
};

export const emptyChannelData = {
  ch0: {
    datasets: [{}]
  },
  ch1: {
    datasets: [{}]
  },
  ch2: {
    datasets: [{}]
  },
  ch3: {
    datasets: [{}]
  }
};

export const emptyAuxChannelData = {
  ch0: {
    datasets: [{}]
  },
  ch1: {
    datasets: [{}]
  },
  ch2: {
    datasets: [{}]
  },
  ch3: {
    datasets: [{}]
  },
  ch4: {
    datasets: [{}]
  }
};

export const emptySingleChannelData = {
  ch1: {
    datasets: [{}]
  }
};


export const generalOptions = {
  scales: {
    xAxes: [
      {
        scaleLabel: {
          display: true
        }
      }
    ],
    yAxes: [
      {
        scaleLabel: {
          display: true
        }
      }
    ]
  },
  elements: {
    point: {
      radius: 0
    }
  },
  title: {
    display: true,
    text: 'Frequencies'
  },
  responsive: true,
  tooltips: { enabled: false },
  legend: { display: false }
};

export const bandLabels = ['Alpha', 'Beta', 'Delta', 'Gamma', 'Theta'];
export const channelLabels = ['TP9', 'AF7', 'AF8', 'TP10', 'Aux'];


export const options: {
  scales: {
      yAxes: [{
        display: true,
        ticks: {
              beginAtZero: true
          }
      }],
      xAxis: [{
        display: true
      }]
}};

export const backgroundColors: string[] = [
  'rgba(255, 99, 132, 0.2)',
  'rgba(54, 162, 235, 0.2)',
  'rgba(255, 206, 26, 0.2)',
  'rgba(75, 92, 192, 0.2)',
  'rgba(153, 102, 255, 0.2)',
];

export const borderColors: string[] = ['rgba(255, 99, 132, 1)',
'rgba(54, 162, 235, 1)',
'rgba(255, 206, 26, 1)',
'rgba(75, 92, 192, 1)',
'rgba(153, 102, 255, 1)',
];

interface ISpectraDataSet {
  label: string;
  data: number[];
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  fill: any;
  lineTension: number;
}
export const spectraDataSet: ISpectraDataSet = {
  data: [],
  backgroundColor: '' ,
  borderColor: '',
  borderWidth: 1,
  fill: false,
  label: '',
  lineTension: 0.4
};

export const spectraLabels = []
