export interface ErrorIssue {
  id: string;
  name: string;
  message: string;
  status: 'open' | 'resolved'; 
  numEvents: number;
  numUsers: number;
}
  