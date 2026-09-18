# Fourier series builder

Interactive visualisation of Fourier series convergence. Pick a waveform, add
harmonics one at a time, and watch the partial sum close in on its target.

**[Open the live demo](https://allywilko18.github.io/fourier-series-builder/)**

## What it shows

Any periodic function can be written as a sum of sines and cosines. This tool
plots the partial sum alongside the function it is approximating, so you can
see the approximation improve term by term.

- Four waveforms: square, sawtooth, triangle and half-wave rectified
- A coefficient spectrum showing the amplitude of each harmonic
- Individual harmonics can be drawn and hovered to link them to the spectrum
- Live RMS error, and the Gibbs overshoot at a jump discontinuity

The spectra are worth comparing. The square and sawtooth waves are
discontinuous and their coefficients fall off as 1/n; the triangle wave is
continuous and falls off as 1/n². Smoothness and convergence rate are the same
fact seen from two directions.

## The maths

Coefficients come from the orthogonality of sines and cosines over a period:

    a_n = (1/π) ∫ f(x)cos(nx) dx
    b_n = (1/π) ∫ f(x)sin(nx) dx

Each was derived by hand for the four waveforms, then checked in the test
suite against numerical integration of those integrals — so a slip in the
algebra fails the build rather than quietly producing a plausible-looking
curve.

## Running it

    npm install
    npm run dev

Tests:

    npm test

## Structure

`src/physics` holds the waveform definitions and the series maths, with no
React imports — it is plain TypeScript and
