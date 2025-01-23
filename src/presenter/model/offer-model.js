const offersData = [
  // Получение списка дополнительных предложений
  {
    type: 'taxi',
    offers: []
  },

  {
    type: 'Bus',
    offers: [
      {
        id: '2',
        title: 'Upgrade to a business class',
        price: 120
      }
    ]
  },

  {
    type: 'Ship',
    offers: [
      {
        id: 'b4c3e4e6-9053-42ce-b747-e281314baa31',
        title: 'Upgrade to a economy class',
        price: 100
      },
      {
        id: 'b4c3e4e6-9053-42ce-b747-e281314baa32',
        title: 'Upgrade to a comfort class',
        price: 150
      },
      {
        id: 'b4c3e4e6-9053-42ce-b747-e281314baa33',
        title: 'Upgrade to a vip class',
        price: 200
      }
    ]
  },
  {
    type: 'Train',
    offers: [
      {
        id: '4',
        title: 'Upgrade to a vip class',
        price: 20
      }
    ]
  },
  {
    type: 'Flight',
    offers: [
      {
        id: '5',
        title: 'Upgrade to a economy class',
        price: 70
      }
    ]
  },
];

export { offersData };
