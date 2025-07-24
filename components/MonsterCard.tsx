import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Monster } from '@/types/MonsterTypes';
import Image from 'next/image';

interface MonsterCardProps {
  monster: Monster;
}

export function MonsterCard({ monster }: MonsterCardProps) {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="text-center pb-3">
        <div className="flex justify-center mb-3">
          <Image
            src={`https://robohash.org/${monster.id}?set=set2&size=180x180`}
            alt={`${monster.name || 'Monster'} avatar`}
            width={120}
            height={120}
            className="rounded-full border-2 border-muted"
            priority={monster.id <= 4}
          />
        </div>
        <h3 className="font-semibold text-lg text-foreground">
          {monster.name}
        </h3>
        <p className="text-sm text-muted-foreground">@{monster.username}</p>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-sm">
          <p className="text-muted-foreground">Email:</p>
          <p className="text-foreground break-all">{monster.email}</p>
        </div>
        <div className="text-sm">
          <p className="text-muted-foreground">City:</p>
          <p className="text-foreground">{monster.address.city}</p>
        </div>
        <div className="text-sm">
          <p className="text-muted-foreground">Company:</p>
          <p className="text-foreground">{monster.company.name}</p>
        </div>
        <div className="text-sm">
          <p className="text-muted-foreground">Website:</p>
          <p className="text-foreground break-all">{monster.website}</p>
        </div>
      </CardContent>
    </Card>
  );
}
