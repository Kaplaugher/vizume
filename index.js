const { Fragment, useState, useCallback, memo } = React;

// SelectedItems component to display selected items at the top
const SelectedItems = memo(({ selectedItems }) => (
  <div className="SelectedItems">
    {selectedItems.length > 0 ? (
      <div>Selected: {selectedItems.join(', ')}</div>
    ) : (
      <div>No items selected</div>
    )}
  </div>
));
SelectedItems.displayName = 'SelectedItems';

// Memoized ListItem component to prevent unnecessary re-renders
const ListItem = memo(({ item, isSelected, onToggle }) => (
  <li
    className={`List__item List__item--${item.color} ${
      isSelected ? 'List__item--selected' : ''
    }`}
    onClick={() => onToggle(item.name)}
  >
    {item.name}
  </li>
));
ListItem.displayName = 'ListItem';

const List = ({ items }) => {
  const [selectedItems, setSelectedItems] = useState([]);

  const toggleItem = useCallback((itemName) => {
    setSelectedItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((name) => name !== itemName)
        : [...prev, itemName]
    );
  }, []);

  return (
    <Fragment>
      <SelectedItems selectedItems={selectedItems} />
      <ul className="List">
        {items.map((item) => (
          <ListItem
            key={item.name}
            item={item}
            isSelected={selectedItems.includes(item.name)}
            onToggle={toggleItem}
          />
        ))}
      </ul>
    </Fragment>
  );
};

// ---------------------------------------
// Do NOT change anything below this line.
// ---------------------------------------

const sizes = ['tiny', 'small', 'medium', 'large', 'huge'];
const colors = [
  'navy',
  'blue',
  'aqua',
  'teal',
  'olive',
  'green',
  'lime',
  'yellow',
  'orange',
  'red',
  'maroon',
  'fuchsia',
  'purple',
  'silver',
  'gray',
  'black',
];
const fruits = [
  'apple',
  'banana',
  'watermelon',
  'orange',
  'peach',
  'tangerine',
  'pear',
  'kiwi',
  'mango',
  'pineapple',
];

const items = sizes.reduce(
  (items, size) => [
    ...items,
    ...fruits.reduce(
      (acc, fruit) => [
        ...acc,
        ...colors.reduce(
          (acc, color) => [
            ...acc,
            {
              name: `${size} ${color} ${fruit}`,
              color,
            },
          ],
          []
        ),
      ],
      []
    ),
  ],
  []
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<List items={items} />);
