import AppKit
import CoreImage
import Foundation

// Local-only QR images; no network or third-party QR service.
guard CommandLine.arguments.count == 3 else {
    fatalError("Usage: make-playtest-qr.swift BASE_URL OUTPUT_DIRECTORY")
}
let base = CommandLine.arguments[1]
let directory = URL(fileURLWithPath: CommandLine.arguments[2], isDirectory: true)
try FileManager.default.createDirectory(at: directory, withIntermediateDirectories: true)
let context = CIContext()
let detector = CIDetector(ofType: CIDetectorTypeQRCode, context: context,
                          options: [CIDetectorAccuracy: CIDetectorAccuracyHigh])!
for id in ["hub", "P1", "P2", "P3", "P4", "P5"] {
    let address = base + (id == "hub" ? "/playtest.html" : "/mobile.html#playtest=" + id)
    let filter = CIFilter(name: "CIQRCodeGenerator")!
    filter.setValue(Data(address.utf8), forKey: "inputMessage")
    filter.setValue("M", forKey: "inputCorrectionLevel")
    let code = filter.outputImage!
    let bounds = code.extent.insetBy(dx: -4, dy: -4)
    let white = CIImage(color: CIColor(red: 1, green: 1, blue: 1)).cropped(to: bounds)
    let padded = code.composited(over: white).transformed(by: CGAffineTransform(translationX: 4, y: 4))
    let scaled = padded.transformed(by: CGAffineTransform(scaleX: 8, y: 8))
    let image = context.createCGImage(scaled, from: scaled.extent)!
    let bitmap = NSBitmapImageRep(cgImage: image)
    let png = bitmap.representation(using: .png, properties: [:])!
    try png.write(to: directory.appendingPathComponent(id + ".png"))
    let decoded = detector.features(in: CIImage(cgImage: image)).compactMap { ($0 as? CIQRCodeFeature)?.messageString }
    guard decoded.contains(address) else { fatalError("QR verification failed for " + id) }
    print(id + " verified: " + address)
}
