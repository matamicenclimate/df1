import { NFTMetadataBackend } from '@/lib/type';
import React from 'react';

export interface TestMintProps {
  onMint: (data: NFTMetadataBackend) => void;
}

let _test_mint_: React.FC<TestMintProps> = (props: TestMintProps) => null;

async function get(what: string) {
  const out = await fetch(what);
  return out.url;
}

if (process.env.NODE_ENV === 'development') {
  class RandSet<A> extends Set<A> {
    pick(): A {
      const values = [...this.values()];
      return values[(values.length * Math.random()) >> 0];
    }
  }
  const authors = new RandSet([
    'Maestro',
    'Friendo',
    'Admiral',
    'Superman',
    'Catwoman',
    'Chico',
    'Oompa Loompa',
    'Candycane',
    'Mr. Clean',
    'Dino',
    'Mouse',
    'Braniac',
    'Shorty',
    'Daria',
    'Dropout',
    'Filly Fally',
    'Apple',
    'Shnookie',
    'Skipper',
    'Red Hot',
    'Button',
    'T-Dawg',
    'Cheeky',
    'Bambi',
  ]);
  const lorem = [
    'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
    'Aenean commodo ligula eget dolor.',
    'Aenean massa.',
    'Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
    'Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.',
    'Nulla consequat massa quis enim.',
    'Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu.',
    'In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.',
    'Nullam dictum felis eu pede mollis pretium.',
    'Integer tincidunt.',
    'Cras dapibus.',
    'Vivamus elementum semper nisi.',
    'Aenean vulputate eleifend tellus.',
    'Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim.',
    'Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus.',
    'Phasellus viverra nulla ut metus varius laoreet.',
    'Quisque rutrum.',
    'Aenean imperdiet.',
    'Etiam ultricies nisi vel augue.',
    'Curabitur ullamcorper ultricies nisi.',
    'Nam eget dui.',
    'Etiam rhoncus.',
    'Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum.',
    'Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem.',
    'Maecenas nec odio et ante tincidunt tempus.',
    'Donec vitae sapien ut libero venenatis faucibus.',
    'Nullam quis ante.',
    'Etiam sit amet orci eget eros faucibus tincidunt.',
    'Duis leo.',
    'Sed fringilla mauris sit amet nibh.',
    'Donec sodales sagittis magna.',
    'Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, quis gravida magna mi a libero.',
    'Fusce vulputate eleifend sapien.',
    'Vestibulum purus quam, scelerisque ut, mollis sed, nonummy id, metus.',
    'Nullam accumsan lorem in dui.',
    'Cras ultricies mi eu turpis hendrerit fringilla.',
    'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; In ac dui quis mi consectetuer lacinia.',
    'Nam pretium turpis et arcu.',
    'Duis arcu tortor, suscipit eget, imperdiet nec, imperdiet iaculis, ipsum.',
    'Sed aliquam ultrices mauris.',
    'Integer ante arcu, accumsan a, consectetuer eget, posuere ut, mauris.',
    'Praesent adipiscing.',
    'Phasellus ullamcorper ipsum rutrum nunc.',
    'Nunc nonummy metus.',
    'Vestibulum volutpat pretium libero.',
    'Cras id dui.',
    'Aenean ut eros et nisl sagittis vestibulum.',
    'Nullam nulla eros, ultricies sit amet, nonummy id, imperdiet feugiat, pede.',
    'Sed lectus.',
    'Donec mollis hendrerit risus.',
    'Phasellus nec sem in justo pellentesque facilisis.',
    'Etiam imperdiet imperdiet orci.',
    'Nunc nec neque.',
    'Phasellus leo dolor, tempus non, auctor et, hendrerit quis, nisi.',
    'Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo.',
    'Maecenas malesuada.',
    'Praesent congue erat at massa.',
    'Sed cursus turpis vitae tortor.',
    'Donec posuere vulputate arcu.',
    'Phasellus accumsan cursus velit.',
    'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed aliquam, nisi quis porttitor ',
    'congue, elit erat euismod orci, ac placerat dolor lectus quis orci.',
    'Phasellus consectetuer vestibulum elit.',
    'Aenean tellus metus, bibendum sed, posuere ac, mattis non, nunc.',
    'Vestibulum fringilla pede sit amet augue.',
    'In turpis.',
    'Pellentesque posuere.',
    'Praesent turpis.',
  ];
  _test_mint_ = function TestMint(props: TestMintProps) {
    return (
      <>
        <button
          style={{ margin: '1rem', padding: '0.5rem', border: '1px solid black' }}
          onClick={async () => {
            const data = 'Здесь текст для файла или положите в переменную Blob';
            const file = new File([data], 'primer.txt', { type: 'text/plain' });
            const dt = new DataTransfer();
            dt.items.add(file);
            const files = dt.files;
            props.onMint({
              author: authors.pick() + ' ' + authors.pick(),
              description: lorem.filter((_) => Math.random() > 0.8).join('\n'),
              file: files,
              image_url: await get('https://picsum.photos/200'),
              ipnft: '00000',
              properties: {
                cause: '6e2ce003-f976-4ea9-93d6-55af26a96352',
                causePercentage: 50,
                price: 0,
                file: files[0],
              },
              price: 9999,
              title: lorem.find(() => Math.random() > 0.8) ?? lorem[lorem.length - 1],
              url: await get('https://picsum.photos/200'),
            });
          }}
        >
          Mint
        </button>
      </>
    );
  };
}

export const TestMint = _test_mint_;
