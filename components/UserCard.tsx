import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { User } from '@/types/UserTypes';
import Image from 'next/image';

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="text-center pb-3">
        <div className="flex justify-center mb-3">
          <Image
            src={`https://robohash.org/${user.id}?set=set2&size=180x180`}
            alt={`${user.name || 'User'} avatar`}
            width={120}
            height={120}
            className="rounded-full border-2 border-muted"
            priority={user.id <= 4}
          />
        </div>
        <h3 className="font-semibold text-lg text-foreground">{user.name}</h3>
        <p className="text-sm text-muted-foreground">@{user.username}</p>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-sm">
          <p className="text-muted-foreground">Email:</p>
          <p className="text-foreground break-all">{user.email}</p>
        </div>
        <div className="text-sm">
          <p className="text-muted-foreground">City:</p>
          <p className="text-foreground">{user.address.city}</p>
        </div>
        <div className="text-sm">
          <p className="text-muted-foreground">Company:</p>
          <p className="text-foreground">{user.company.name}</p>
        </div>
        <div className="text-sm">
          <p className="text-muted-foreground">Website:</p>
          <p className="text-foreground break-all">{user.website}</p>
        </div>
      </CardContent>
    </Card>
  );
}