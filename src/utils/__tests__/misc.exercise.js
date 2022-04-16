import {formatDate} from 'utils/misc'

test('formatDate formats the date to look nice', () => {
  const actual = formatDate(new Date('1995-12-17T03:24:00'))
  expect(actual).toEqual('Dec 95')
})
