export interface IBooking {
  id?: number;
  user_id: number;
  workplace_id: number;
  start_time: string;
  end_time: string;
  status: 'reserved' | 'completed' | 'cancelled' | 'occupied';
}