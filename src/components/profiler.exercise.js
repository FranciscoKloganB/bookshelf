// this is for extra credit
import React from 'react'
import {client} from 'utils/api-client'

let reportQueue = []

function sendAggregatedReports() {
  if (!reportQueue.length) {
    return Promise.resolve({success: true})
  }

  const reports = [...reportQueue]
  reportQueue = []

  return client('profile', {data: reports}).catch(e =>
    console.error(
      'Unable to send aggregated React.Profiler reports to remote storage',
      e,
    ),
  )
}

setInterval(sendAggregatedReports, 5000)

function Profiler({children, metadata, phases, profilerId}) {
  /**
   * Aggregates performance reports for all React lifecycle phases, when phases
   * prop is not provided. Otherwise aggregates only on specified phases.
   *
   * Profiler reports are sent to backend every 5 seconds.
   */
  function aggregate(
    id, // the "id" prop of the Profiler tree that has just committed
    phase, // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
    actualDuration, // time spent rendering the committed update
    baseDuration, // estimated time to render the entire subtree without memoization
    startTime, // when React began rendering this update
    commitTime, // when React committed this update
    interactions, // the Set of interactions belonging to this update
  ) {
    if (!phases || phases.includes(phase)) {
      reportQueue.push({
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime,
        interactions,
        metadata
      })
    }
  }

  return (
    <React.Profiler id={profilerId} onRender={aggregate} phases={phases}>
      {children}
    </React.Profiler>
  )
}

export {Profiler}
