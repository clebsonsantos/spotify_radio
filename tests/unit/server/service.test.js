import { jest, expect, describe, test, beforeEach } from '@jest/globals'
import { Service } from '../../../server/service.js'
import TestUtil from '../_util/testUtil.js'
import config from '../../../server/config.js'
import fs from 'fs'
import fsPromises from 'fs/promises'
import { join } from 'path'

const {dir: { publicDirectory }} = config

describe('#Services - test suit for services', () => {
  const service = new Service()

  beforeEach(() => {
    jest.restoreAllMocks()
    jest.clearAllMocks()
  })

  test('Must return a type and name of a passed file - using: [getFileStream]', async () => {
    const filename = '/index.html'
    const mockReadableStream = TestUtil.generateReadableStream(['any_file'])
    const expectedType = '.html'

    jest.spyOn(
      Service.prototype,
      Service.prototype.getFileInfo.name
    ).mockReturnValue(
      {
        type: expectedType,
        name: filename,
      })

    jest.spyOn(
      Service.prototype, 
      Service.prototype.createFileStream.name
    ).mockReturnValue(mockReadableStream)

    const expectResult = await service.getFileStream(filename)

    expect(Service.prototype.createFileStream).toHaveBeenCalledWith(filename)
    expect(expectResult).toEqual({
      stream: mockReadableStream,
      type: expectedType,
    })
  })

  test('Should return an object containing a name and type - using: [getFileInfo]', async () => {
    const filename = '/index.html'
    const expectedfullFilePath = join(publicDirectory, filename)
    const expectedResult = {
      type: '.html',
      name: expectedfullFilePath,
    }

    jest.spyOn(
      fsPromises, 
      fsPromises.access.name
    ).mockReturnValue()

    const FileInfo = await service.getFileInfo(filename)

    expect(fsPromises.access).toHaveBeenCalledWith(expectedfullFilePath)
    expect(FileInfo).toEqual(expectedResult)
  })

  test('Should return a fileStream - using: [createFileStream]', async () => {
    const filename = 'any_file.html'

    const mockReadableStream = TestUtil.generateReadableStream(['any_file'])

    jest.spyOn(
      fs, 
      fs.createReadStream.name
    ).mockReturnValue(mockReadableStream)

    const createFileStream = service.createFileStream(filename)

    expect(fs.createReadStream).toHaveBeenCalledWith(filename)
    expect(createFileStream).toEqual(mockReadableStream)
  })

  describe('exceptions', () => {

    test('Should return an error if file does not exists - using: [getFileInfo]', async () => {
      const filename = '/any_file.html'
      const fullFilePath = join(publicDirectory, filename)

      jest.spyOn(
        fsPromises, 
        fsPromises.access.name
      ).mockRejectedValue( new Error('Error: ENOENT: no such file or directory'))

      const fileInfo = service.getFileInfo(filename)

      expect(fsPromises.access).toHaveBeenCalledWith(fullFilePath)
      expect(fileInfo).rejects.toThrow()
    })
  })
})