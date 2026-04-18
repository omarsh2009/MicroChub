import { UserDetailsClientPage } from './client';

export default function UserDetailsPage({ params }: { params: { id: string } }) {
  return <UserDetailsClientPage userId={params.id} />;
}
