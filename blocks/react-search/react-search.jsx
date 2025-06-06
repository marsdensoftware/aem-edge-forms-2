/* eslint-disable */
// eslint-disable-next-line import/extensions
//import * as React from 'react';
//import * as ReactDOM from 'react-dom/client';
import React, { useState, useEffect } from 'react';
import ReactDOMClient, { createRoot } from 'react-dom/client';

import InfiniteScroll from 'react-infinite-scroll-component';

async function searchResults(pager) {
  return await fetch(`https://dummyjson.com/users?${pager.pageSizeArg}=${pager.pageSize}&${pager.offsetArg}=${pager.offset}&select=id,firstName,lastName,age,gender,birthDate,company`)
    .then((r) => {
      if (!r.ok) {
        throw new Error(`Received: ${r.status}`);
      }
      return r.json();
    })
    .catch((e) => console.log(`Error: ${e.message}`));
}

// eslint-disable-next-line no-unused-vars
function ReactTestHeader() {
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(null);
  const [offset, setOffset] = useState(null);

  //  prev() {
  //  return this.offset > 0 ? this.offset - this.pageSize : null;
  //},

  // TODO make pager extend react.component or make separate usestate vars for parts

  const nextPage = function(total, offset, pageSize) {
    return (total !== null && offset + pageSize < total)
      ? offset + pageSize : null;
  };

  const pager = {
    loading: false,

    infinite: false,
    infiniteArg: 'infinite',

    offset: 0,
    offsetArg: 'skip',

    pageSize: 10,
    pageSizeArg: 'limit',

    total: null,
    // TODO clamp?
  };

  const search = async (pager) => {
    const newResults = await searchResults({...pager, offset: offset});
    setResults([...results.concat(newResults.users)]);
    console.log('new results', newResults, newResults.users);
    setTotal(newResults.total);
  };

  useEffect(() => {
    if (offset === null) {
      return;
    }
    async function wrapper() {
      await search({...pager, offset: offset});
    };
    wrapper();
  }, [offset]);

  return (
    <div>
      <h1>Hello from React!</h1>
      <label>Total available: {total || 'unknown'}</label>
      <button type='button' onClick={() => setOffset(0)}>React Search</button>
      {results &&
        <InfiniteScroll
          dataLength={results.length}
          next={() => {
            const next = nextPage(total, offset, pager.pageSize);
            console.log('more?:', next);
            if (next !== null) {
              setOffset(next);
            }
          }}
          hasMore={total !== null && total > results.length}
          loader={<h4>Loading...</h4>}
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>You have reached the end of the data.</b>
            </p>
          }
        >
        <table>
          <tbody>
            {
              results.map((row) => {
                return (<tr key={row.id}>{
                  Object.entries(row).map(([name, value]) => <td key={name}>{typeof value !== 'object' ? value : JSON.stringify(value)}</td>)
                }</tr>);
              })
            }
          </tbody>
        </table>
      </InfiniteScroll>}
    </div>
  );
}

/*
It would be good if we could make a custom block that can accept child blocks, or failing that a form with a custom decorate(), but if we can't then we try to find the parent section and take over it? be careful hydrating the react block... (circular ref)

1. get parent seection (or just use block itself if custom block nesting is available?)
2. hydrateRoot on section; this means reverse engineering the AEM div soup layout correctly and preserving attributes
3. how to model behaviour? need custom fields and attributes?
how can we know this at hydrate?
register some info in sessionstorage or a library var through custom decorate() for fields
e.g. text field X lists its states?
input field Y lists that it uses X by name (and has an AEM content thingy for that)
at hydrate we somehow hook these up?

N.B. we don't technically need to hydrate, we could parse the html and createRoot

dynamically build the JSX to hydrate


 * work out how to do dynamic JSX
 -- need to bundle possible options and switch between them??
 -- some workarounds with string interpol as vars or React.createClass
 -- see https://stackoverflow.com/questions/33471880/dynamic-tag-name-in-react-jsx

 * get a static hydrate working first
 * then get something interactive working with hard-coded classes/ids
 */

// N.B. the infinite scroll library uses viewport triggers so multiple elements will both
// trigger on scrolling the bottom
// Using the observer api would avoid this
export default async function decorate(block) {
  console.log('decorate called on block', block);
  console.log('block parent?', block.closest('.section'));
  // Or document.querySelector('.section:has(.block.react-search)') will also work
  // Could also select children of block in that case (block.children?)
  window.addEventListener('onbeforeunload', () => { // or run this in scripts.js?
    sessionStorage.clear(); // or remove only the prefix?
  });
  // TODO check if this is async safe
  const prefix = parseInt(sessionStorage.getItem('react-block-prefix') || 0, 10) + 1;
  console.log('fetched and incremented prefix', prefix);
  sessionStorage.setItem('react-block-prefix', prefix);

  // TODO we could avoid prefixing by simply appending to the block
  //      but either way, we must maintain strict hygiene about the use
  //      of id in our block scripts
  const div0 = document.createElement('div');
  div0.id = `${prefix}-div0`;

  const div1 = document.createElement('div');
  div1.id = `${prefix}-test-root`;

  div0.append(div1);
  block.append(div0);

  const prev = typeof __COMMIT_HASH__ === 'undefined' ? 'unknown' : __COMMIT_HASH__;
  console.log('React running on the next commit after ' + prev);
  const domNode = document.getElementById(`${prefix}-test-root`);
  const root = createRoot(domNode);
  root.render(<ReactTestHeader />);
}
